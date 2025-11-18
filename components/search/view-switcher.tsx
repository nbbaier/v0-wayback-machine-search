"use client";

import { LayoutGrid, Table2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const views = [
	{
		name: "Cards",
		href: "/cards",
		icon: LayoutGrid,
	},
	{
		name: "Table",
		href: "/table",
		icon: Table2,
	},
	{
		name: "Timeline",
		href: "/timeline",
		icon: Sparkles,
	},
];

export function ViewSwitcher() {
	const pathname = usePathname();

	return (
		<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
			{views.map((view) => {
				const Icon = view.icon;
				const isActive = pathname === view.href;

				return (
					<Link
						key={view.href}
						href={view.href}
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground hover:bg-background/50"
						)}
					>
						<Icon className="h-4 w-4" />
						<span className="hidden sm:inline">{view.name}</span>
					</Link>
				);
			})}
		</div>
	);
}
