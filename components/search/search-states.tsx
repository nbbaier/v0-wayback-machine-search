import { Loader2, type LucideIcon } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  cardClassName?: string;
}

export function LoadingState({
  message = "Loading snapshots...",
  cardClassName = "",
}: LoadingStateProps) {
  return (
    <div className={`py-16 text-center ${cardClassName}`}>
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      <p className="mt-3 text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  subtitle?: string;
}

export function ErrorState({
  message = "Failed to load snapshots",
  subtitle,
}: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-destructive">{message}</p>
      {subtitle && (
        <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground/50" />
      <h3 className="mt-4 font-serif text-foreground text-xl">{title}</h3>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}

interface NoResultsStateProps {
  message?: string;
}

export function NoResultsState({
  message = "No snapshots found in the archive",
}: NoResultsStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
