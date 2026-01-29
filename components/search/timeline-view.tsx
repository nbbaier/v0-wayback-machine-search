import { useMemo, useState } from "react";
import { TimelineGroup } from "@/components/snapshot/timeline-group";
import type { GroupedSnapshotByMonth, Snapshot } from "@/lib/types/archive";

interface TimelineViewProps {
  results: Snapshot[];
}

export function TimelineView({ results }: TimelineViewProps) {
  const [selectedYear, setSelectedYear] = useState("");

  const availableYears = useMemo(() => {
    const years = new Set(results.map((r) => r.timestamp.slice(0, 4)));
    return Array.from(years).sort().reverse();
  }, [results]);

  const groupedByYearMonth = useMemo(() => {
    let filtered = results;
    if (selectedYear) {
      filtered = results.filter((r) => r.timestamp.startsWith(selectedYear));
    }

    const groups = new Map<string, GroupedSnapshotByMonth>();
    for (const snapshot of filtered) {
      const year = snapshot.timestamp.slice(0, 4);
      const month = snapshot.timestamp.slice(4, 6);
      const key = `${year}-${month}`;

      if (!groups.has(key)) {
        groups.set(key, { year, month, snapshots: [] });
      }
      groups.get(key)?.snapshots.push(snapshot);
    }

    return Array.from(groups.values()).sort((a, b) =>
      `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`)
    );
  }, [results, selectedYear]);

  const yearButtonClass = (year: string) =>
    `text-sm ${selectedYear === year ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <>
      {availableYears.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Filter by year:</span>
          <button
            className={yearButtonClass("")}
            onClick={() => setSelectedYear("")}
            type="button"
          >
            All ({results.length})
          </button>
          {availableYears.map((year) => (
            <button
              className={yearButtonClass(year)}
              key={year}
              onClick={() => setSelectedYear(year)}
              type="button"
            >
              {year} (
              {results.filter((r) => r.timestamp.startsWith(year)).length})
            </button>
          ))}
        </div>
      )}

      {groupedByYearMonth.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-border md:left-1/2" />
          <div className="space-y-6">
            {groupedByYearMonth.map((group, groupIdx) => (
              <TimelineGroup
                group={group}
                groupIdx={groupIdx}
                key={`${group.year}-${group.month}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
