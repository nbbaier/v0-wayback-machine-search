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
			<div className="absolute left-4 md:left-1/2 -ml-3 md:-ml-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600 border-4 border-white dark:border-gray-900 shadow-lg shadow-purple-500/50 z-10 flex items-center justify-center">
				<Calendar className="h-3 w-3 md:h-4 md:w-4 text-white" />
			</div>

			<div
				className={`ml-16 md:ml-0 ${groupIdx % 2 === 0 ? "md:mr-[52%]" : "md:ml-[52%]"}`}
			>
				<div className="mb-3">
					<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
						{monthNames[parseInt(group.month, 10) - 1]} {group.year}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
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
