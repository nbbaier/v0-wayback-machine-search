import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/formatters";
import { StatusBadge } from "./status-badge";

interface SnapshotMetadataProps {
  status: string;
  mimetype: string;
  length?: string;
  showStatusColor?: boolean;
}

export function SnapshotMetadata({
  status,
  mimetype,
  length,
  showStatusColor = true,
}: SnapshotMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showStatusColor ? (
        <StatusBadge status={status} />
      ) : (
        <Badge
          className="text-xs"
          variant={status === "200" ? "default" : "secondary"}
        >
          {status}
        </Badge>
      )}
      <span className="text-muted-foreground text-xs">{mimetype}</span>
      {length && (
        <span className="text-muted-foreground text-xs">
          {formatBytes(length)}
        </span>
      )}
    </div>
  );
}
