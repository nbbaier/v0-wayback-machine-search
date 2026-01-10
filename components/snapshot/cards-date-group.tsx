import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Calendar } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import type { GroupedSnapshot } from "@/lib/types/archive";
import { formatDate } from "@/lib/utils/formatters";
import { SnapshotCard } from "./snapshot-card";

interface CardsDateGroupProps {
	group: GroupedSnapshot;
}

export const CardsDateGroup = memo(function CardsDateGroup({
	group,
}: CardsDateGroupProps) {
	return (
		<Collapsible className="w-full rounded-lg border text-card-foreground shadow-sm overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
			<CollapsibleTrigger className="flex w-full items-center gap-3 p-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
					<Calendar className="h-5 w-5 text-primary" />
				</div>
				<div className="flex-1 text-left">
					<h4 className="text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						{formatDate(group.date)}
					</h4>
					<p className="text-muted-foreground text-sm">Click to expand</p>
				</div>
				<Badge
					variant="secondary"
					className="bg-primary/10 text-primary border-primary/20"
				>
					{group.snapshots.length} snapshot
					{group.snapshots.length !== 1 ? "s" : ""}
				</Badge>
			</CollapsibleTrigger>
			<CollapsibleContent className="border-t pt-1 text-muted-foreground text-sm">
				<div className="divide-y divide-border">
					{group.snapshots.map((snapshot) => (
						<SnapshotCard key={snapshot.timestamp} snapshot={snapshot} />
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});
