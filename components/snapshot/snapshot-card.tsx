import { ExternalLink } from "lucide-react";
import { memo } from "react";
import type { ArchiveResult } from "@/lib/types/archive";
import { formatBytes, formatTime } from "@/lib/utils/formatters";
import { StatusBadge } from "./status-badge";

interface SnapshotCardProps {
  snapshot: ArchiveResult;
}

export const SnapshotCard = memo(function SnapshotCard({
  snapshot,
}: SnapshotCardProps) {
  return (
    <div className="group flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-muted/40">
      <div className="min-w-0 flex-1">
        <p className="truncate text-foreground">{snapshot.url}</p>
        <div className="mt-0.5 flex items-center gap-3 text-muted-foreground text-sm">
          <span className="font-mono">{formatTime(snapshot.timestamp)}</span>
          <StatusBadge status={snapshot.status} />
          <span>{snapshot.mimetype}</span>
          {snapshot.length && <span>{formatBytes(snapshot.length)}</span>}
        </div>
      </div>

      <a
        aria-label={`Open archive for ${snapshot.url} from ${formatTime(snapshot.timestamp)} in new tab`}
        className="shrink-0 text-primary text-sm underline-offset-4 hover:underline"
        href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
        onClick={(e) => e.stopPropagation()}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="hidden sm:inline">Open Archive</span>
        <ExternalLink className="h-4 w-4 sm:hidden" />
      </a>
    </div>
  );
});
