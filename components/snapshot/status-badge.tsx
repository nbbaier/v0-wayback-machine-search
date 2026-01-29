import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "outline";
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const isSuccess = status.startsWith("2");
  const isRedirect = status.startsWith("3");

  if (variant) {
    return <Badge variant={variant}>{status}</Badge>;
  }

  let colorClass = "bg-destructive/10 text-destructive border-destructive/30";
  if (isSuccess) {
    colorClass = "bg-chart-2/10 text-chart-2 border-chart-2/30";
  } else if (isRedirect) {
    colorClass = "bg-chart-3/10 text-chart-3 border-chart-3/30";
  }

  return (
    <Badge className={`border font-medium text-xs ${colorClass}`}>
      {status}
    </Badge>
  );
}
