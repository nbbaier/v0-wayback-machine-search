import { Clock, ExternalLink } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="group relative p-4 transition-all duration-300 hover:bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 pr-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="bg-gradient-to-r from-primary to-accent bg-clip-text font-medium font-mono text-base text-muted-foreground">
              {formatTime(snapshot.timestamp)}
            </div>
            <div className="flex items-start gap-2">
              <p className="text-muted-foreground/90 text-sm transition-colors">
                {snapshot.url}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={snapshot.status} />
          <Badge className="bg-muted/50 text-xs" variant="outline">
            {snapshot.mimetype}
          </Badge>
          {snapshot.length && (
            <Badge className="bg-muted/50 text-xs" variant="outline">
              {formatBytes(snapshot.length)}
            </Badge>
          )}
        </div>

        <Button
          asChild
          className="shrink-0 bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 hover:opacity-90 hover:shadow-lg"
          size="sm"
        >
          <a
            aria-label={`Open archive for ${snapshot.url} from ${formatTime(snapshot.timestamp)} in new tab`}
            href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
            onClick={(e) => e.stopPropagation()}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            Open Archive
          </a>
        </Button>
      </div>
    </div>
  );
});
