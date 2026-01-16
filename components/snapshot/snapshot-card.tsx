import { memo } from "react";
import { Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArchiveSnapshot } from "@/lib/types/archive";
import { formatBytes, formatTime } from "@/lib/utils/formatters";
import { StatusBadge } from "./status-badge";

interface SnapshotCardProps {
	snapshot: ArchiveSnapshot;
}

export const SnapshotCard = memo(function SnapshotCard({
	snapshot,
}: SnapshotCardProps) {
	return (
		<div className="relative p-4 hover:bg-muted/30 transition-all duration-300 group ">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 pr-2">
					<div className="flex h-10 w-10 items-center justify-center rounded-md ">
						<Clock className="h-5 w-5 text-primary" />
					</div>
					<div>
						<div className="text-base font-mono text-muted-foreground font-medium bg-gradient-to-r from-primary to-accent bg-clip-text ">
							{formatTime(snapshot.timestamp)}
						</div>
						<div className="flex items-start gap-2">
							<p className="text-sm text-muted-foreground/90 transition-colors">
								{snapshot.url}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<StatusBadge status={snapshot.status} />
					<Badge variant="outline" className="text-xs bg-muted/50">
						{snapshot.mimetype}
					</Badge>
					{snapshot.length && (
						<Badge variant="outline" className="text-xs bg-muted/50">
							{formatBytes(snapshot.length)}
						</Badge>
					)}
				</div>

				<Button
					size="sm"
					className="bg-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all shrink-0"
					asChild
				>
					<a
						href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()}
						aria-label={`Open archive for ${snapshot.url} from ${formatTime(snapshot.timestamp)} in new tab`}
					>
						<ExternalLink className="h-4 w-4 mr-1" />
						Open Archive
					</a>
				</Button>
			</div>
		</div>
	);
});
