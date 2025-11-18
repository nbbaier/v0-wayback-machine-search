import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ArchiveResult } from "@/lib/types/archive";
import { formatTimestamp } from "@/lib/utils/formatters";
import { SnapshotMetadata } from "./snapshot-metadata";
import { SnapshotPreview } from "./snapshot-preview";

interface TimelineSnapshotCardProps {
	snapshot: ArchiveResult;
}

export function TimelineSnapshotCard({ snapshot }: TimelineSnapshotCardProps) {
	return (
		<Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<SnapshotPreview mimetype={snapshot.mimetype} />

					<div className="flex-1 min-w-0">
						<SnapshotMetadata
							status={snapshot.status}
							mimetype={snapshot.mimetype}
							length={snapshot.length}
							showStatusColor={false}
						/>

						<p className="text-sm text-gray-700 dark:text-gray-300 mb-2 mt-2">
							{formatTimestamp(snapshot.timestamp)}
						</p>

						<a
							href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
						>
							<ExternalLink className="h-4 w-4" />
							View Snapshot
						</a>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
