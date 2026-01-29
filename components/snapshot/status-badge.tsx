interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isSuccess = status.startsWith("2");
  const isRedirect = status.startsWith("3");

  let colorClass = "text-destructive";
  if (isSuccess) {
    colorClass = "text-chart-2";
  } else if (isRedirect) {
    colorClass = "text-chart-3";
  }

  return <span className={`font-mono ${colorClass}`}>{status}</span>;
}
