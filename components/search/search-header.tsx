import { type LucideIcon } from "lucide-react";
import { ViewSwitcher } from "./view-switcher";

interface SearchHeaderProps {
	title: string;
	description: string;
	icon: LucideIcon;
	iconBgClass?: string;
	titleGradient?: string;
}

export function SearchHeader({
	title,
	description,
	icon: Icon,
	iconBgClass = "bg-primary",
	titleGradient = "from-primary to-accent",
}: SearchHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-4">
			<div>
				<div className="flex items-center gap-3">
					<div className={`p-2 rounded-lg ${iconBgClass}`}>
						<Icon className="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<h1
							className={`text-2xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
						>
							{title}
						</h1>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>
				</div>
			</div>
			<ViewSwitcher />
		</div>
	);
}
