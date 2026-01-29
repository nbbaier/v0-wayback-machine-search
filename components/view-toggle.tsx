import { Clock, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "cards" | "timeline";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
      <Button
        aria-label="Cards view"
        onClick={() => onViewChange("cards")}
        size="sm"
        variant={view === "cards" ? "default" : "ghost"}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </Button>
      <Button
        aria-label="Timeline view"
        onClick={() => onViewChange("timeline")}
        size="sm"
        variant={view === "timeline" ? "default" : "ghost"}
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Timeline</span>
      </Button>
    </div>
  );
}
