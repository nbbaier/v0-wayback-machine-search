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
    <Card className="overflow-hidden border-purple-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 dark:border-purple-800/50 dark:bg-gray-900/80">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <SnapshotPreview mimetype={snapshot.mimetype} />

          <div className="min-w-0 flex-1">
            <SnapshotMetadata
              length={snapshot.length}
              mimetype={snapshot.mimetype}
              showStatusColor={false}
              status={snapshot.status}
            />

            <p className="mt-2 mb-2 text-gray-700 text-sm dark:text-gray-300">
              {formatTimestamp(snapshot.timestamp)}
            </p>

            <a
              className="inline-flex items-center gap-2 text-purple-600 text-sm hover:underline dark:text-purple-400"
              href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
              rel="noopener noreferrer"
              target="_blank"
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
