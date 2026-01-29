import type { ArchiveResult } from "@/lib/types/archive";
import { formatBytes, formatTimestamp } from "@/lib/utils/formatters";
import { StatusBadge } from "./status-badge";

interface TimelineSnapshotCardProps {
  snapshot: ArchiveResult;
}

export function TimelineSnapshotCard({ snapshot }: TimelineSnapshotCardProps) {
  return (
    <div className="border-primary/30 border-l-2 py-2 pr-4 pl-4 transition-colors hover:border-primary hover:bg-muted/30">
      <p className="truncate text-foreground text-sm">{snapshot.url}</p>
      <div className="mt-1 flex items-center gap-3 text-muted-foreground text-xs">
        <span className="font-mono">{formatTimestamp(snapshot.timestamp)}</span>
        <StatusBadge status={snapshot.status} />
        <span>{snapshot.mimetype}</span>
        {snapshot.length && <span>{formatBytes(snapshot.length)}</span>}
      </div>
      <a
        className="mt-1 inline-block text-primary text-xs underline-offset-4 hover:underline"
        href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View Snapshot
      </a>
    </div>
  );
}
