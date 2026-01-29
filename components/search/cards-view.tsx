import { useDeferredValue, useMemo, useState } from "react";
import { CardsDateGroup } from "@/components/snapshot/cards-date-group";
import { Input } from "@/components/ui/input";
import type { GroupedSnapshot, Snapshot } from "@/lib/types/archive";

interface CardsViewProps {
  results: Snapshot[];
}

export function CardsView({ results }: CardsViewProps) {
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);

  const groupedByDate = useMemo(() => {
    let filtered = results;
    if (deferredFilter) {
      const lowerFilter = deferredFilter.toLowerCase();
      filtered = results.filter(
        (r) =>
          r.url.toLowerCase().includes(lowerFilter) ||
          r.timestamp.includes(deferredFilter) ||
          r.status.includes(deferredFilter) ||
          r.mimetype.toLowerCase().includes(lowerFilter)
      );
    }

    const groups = new Map<string, GroupedSnapshot>();
    for (const snapshot of filtered) {
      const dateKey = snapshot.timestamp.slice(0, 8);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, { date: dateKey, snapshots: [] });
      }
      groups.get(dateKey)?.snapshots.push(snapshot);
    }

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        snapshots: group.snapshots.sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        ),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [results, deferredFilter]);

  return (
    <>
      {results.length > 0 && (
        <Input
          aria-label="Filter snapshots"
          className="mb-6"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter snapshots..."
          value={filter}
        />
      )}

      {groupedByDate.length > 0 && (
        <>
          <p className="mb-6 text-muted-foreground text-sm">
            {groupedByDate.reduce((acc, g) => acc + g.snapshots.length, 0)}{" "}
            snapshots across {groupedByDate.length} days
            {filter && " (filtered)"}
          </p>
          <div className="space-y-3">
            {groupedByDate.map((group) => (
              <CardsDateGroup group={group} key={group.date} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
