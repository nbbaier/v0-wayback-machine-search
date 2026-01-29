import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Calendar, ChevronDown } from "lucide-react";
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
    <Collapsible className="w-full overflow-hidden rounded-lg border border-primary/20 bg-card/80 text-card-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="bg-linear-to-r from-primary to-primary/50 bg-clip-text font-medium text-lg text-transparent">
            {formatDate(group.date)}
          </h4>
          <p className="text-muted-foreground text-sm group-data-[state=open]:hidden">
            Click to expand
          </p>
          <p className="hidden text-muted-foreground text-sm group-data-[state=open]:block">
            Click to collapse
          </p>
        </div>
        <Badge
          className="border-primary/20 bg-primary/10 text-primary"
          variant="secondary"
        >
          {group.snapshots.length} snapshot
          {group.snapshots.length !== 1 ? "s" : ""}
        </Badge>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
