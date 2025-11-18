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
		<div className="flex items-center gap-2 flex-wrap">
			{showStatusColor ? (
				<StatusBadge status={status} />
			) : (
				<Badge
					variant={status === "200" ? "default" : "secondary"}
					className="text-xs"
				>
					{status}
				</Badge>
			)}
			<span className="text-xs text-muted-foreground">{mimetype}</span>
			{length && (
				<span className="text-xs text-muted-foreground">
					{formatBytes(length)}
				</span>
			)}
		</div>
	);
}
