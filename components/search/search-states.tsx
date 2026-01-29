import { Clock, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
  iconClass?: string;
  cardClassName?: string;
}

export function LoadingState({
  message = "Loading snapshots...",
  iconClass = "text-primary",
  cardClassName = "bg-card/50 backdrop-blur-sm border-primary/20",
}: LoadingStateProps) {
  return (
    <Card className={`p-12 text-center ${cardClassName}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary opacity-50 blur-xl" />
          <Clock className={`h-12 w-12 ${iconClass} relative animate-spin`} />
        </div>
        <p className="font-medium text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}

interface ErrorStateProps {
  message?: string;
  subtitle?: string;
  cardClassName?: string;
}

export function ErrorState({
  message = "Failed to load snapshots",
  subtitle,
  cardClassName = "border-destructive/50",
}: ErrorStateProps) {
  return (
    <Card className={`p-12 text-center ${cardClassName}`}>
      <p className="font-medium text-destructive">{message}</p>
      {subtitle && (
        <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
      )}
    </Card>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClass?: string;
  titleGradient?: string;
  cardClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  iconBgClass = "bg-primary",
  titleGradient = "from-primary to-accent",
  cardClassName = "bg-card/50 backdrop-blur-sm border-primary/20",
}: EmptyStateProps) {
  return (
    <Card className={`p-12 text-center ${cardClassName}`}>
      <div className={`inline-block p-4 ${iconBgClass} mb-4 rounded-2xl`}>
        <Icon className="h-16 w-16 text-primary-foreground" />
      </div>
      <h3
        className={`mb-2 bg-linear-to-r font-bold text-xl ${titleGradient} bg-clip-text text-transparent`}
      >
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

interface NoResultsStateProps {
  message?: string;
}

export function NoResultsState({
  message = "No snapshots found in the archive",
}: NoResultsStateProps) {
  return (
    <Card className="p-12 text-center">
      <p className="text-muted-foreground">{message}</p>
    </Card>
  );
}
