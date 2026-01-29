import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Calendar, ChevronDown } from "lucide-react";
import { memo } from "react";
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
    <Collapsible className="w-full border-primary/30 border-l-2 bg-card text-card-foreground transition-colors hover:border-primary">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 px-5 py-4">
        <Calendar className="h-4 w-4 text-primary" />
        <div className="flex-1 text-left">
          <h4 className="font-serif text-foreground text-lg">
            {formatDate(group.date)}
          </h4>
        </div>
        <span className="text-muted-foreground text-sm">
          {group.snapshots.length} snapshot
          {group.snapshots.length !== 1 ? "s" : ""}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-border/50 border-t">
        <div className="divide-y divide-border/50">
          {group.snapshots.map((snapshot) => (
            <SnapshotCard key={snapshot.timestamp} snapshot={snapshot} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
