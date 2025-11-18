import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Calendar, Clock, ExternalLink, LucideClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GroupedSnapshot } from "@/lib/types/archive";
import { formatBytes, formatDate, formatTime } from "@/lib/utils/formatters";
import { StatusBadge } from "./status-badge";

interface CardsDateGroupProps {
	group: GroupedSnapshot;
}

export function CardsDateGroup({ group }: CardsDateGroupProps) {
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
						<div
							key={snapshot.timestamp}
							className="relative p-4 hover:bg-muted/30 transition-all duration-300 group "
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 pr-2">
									<div className="flex h-10 w-10 items-center justify-center rounded-md ">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="text-base font-mono text-muted-foreground font-medium bg-gradient-to-r from-primary to-accent bg-clip-text ">
											{formatTime(snapshot.timestamp)}
										</div>
										<div className="flex items-start gap-2">
											<p className="text-sm text-muted-foreground/90 transition-colors">
												{snapshot.url}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<StatusBadge status={snapshot.status} />
									<Badge variant="outline" className="text-xs bg-muted/50">
										{snapshot.mimetype}
									</Badge>
									{snapshot.length && (
										<Badge variant="outline" className="text-xs bg-muted/50">
											{formatBytes(snapshot.length)}
										</Badge>
									)}
								</div>

								<a
									href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="shrink-0  "
								>
									<Button
										size="sm"
										className="bg-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all"
									>
										<ExternalLink className="h-4 w-4 mr-1" />
										Open Archive
									</Button>
								</a>
							</div>
						</div>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
