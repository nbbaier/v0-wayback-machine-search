import { Calendar } from "lucide-react";
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
      <div className="absolute left-4 z-10 -ml-3 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600 shadow-lg shadow-purple-500/50 md:left-1/2 md:-ml-4 md:h-8 md:w-8 dark:border-gray-900">
        <Calendar className="h-3 w-3 text-white md:h-4 md:w-4" />
      </div>

      <div
        className={`ml-16 md:ml-0 ${groupIdx % 2 === 0 ? "md:mr-[52%]" : "md:ml-[52%]"}`}
      >
        <div className="mb-3">
          <h3 className="font-bold text-gray-800 text-xl dark:text-gray-200">
            {monthNames[Number.parseInt(group.month, 10) - 1]} {group.year}
          </h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            {group.snapshots.length} snapshot
            {group.snapshots.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-3">
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
