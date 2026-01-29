import type { GroupedSnapshotByMonth } from "@/lib/types/archive";
import { monthNames } from "@/lib/utils/formatters";
import { TimelineSnapshotCard } from "./timeline-snapshot-card";

interface TimelineGroupProps {
  group: GroupedSnapshotByMonth;
  groupIdx: number;
}

export function TimelineGroup({ group, groupIdx }: TimelineGroupProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 z-10 -ml-1 h-2 w-2 rounded-full bg-primary md:left-1/2" />

      <div
        className={`ml-12 md:ml-0 ${groupIdx % 2 === 0 ? "md:mr-[52%]" : "md:ml-[52%]"}`}
      >
        <div className="mb-2">
          <h3 className="font-serif text-foreground text-lg">
            {monthNames[Number.parseInt(group.month, 10) - 1]} {group.year}
          </h3>
          <p className="text-muted-foreground text-sm">
            {group.snapshots.length} snapshot
            {group.snapshots.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          {group.snapshots.map((snapshot, index) => (
            <TimelineSnapshotCard
              key={`${snapshot.timestamp}-${snapshot.url}-${index}`}
              snapshot={snapshot}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
