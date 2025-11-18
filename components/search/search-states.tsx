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
					<div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-pulse" />
					<Clock className={`h-12 w-12 ${iconClass} animate-spin relative`} />
				</div>
				<p className="text-muted-foreground font-medium">{message}</p>
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
			<p className="text-destructive font-medium">{message}</p>
			{subtitle && (
				<p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
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
			<div className={`inline-block p-4 ${iconBgClass} rounded-2xl mb-4`}>
				<Icon className="h-16 w-16 text-primary-foreground" />
			</div>
			<h3
				className={`text-xl font-bold mb-2 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
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
