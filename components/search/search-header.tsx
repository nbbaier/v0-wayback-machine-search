import type { LucideIcon } from "lucide-react";
import { ViewSwitcher } from "./view-switcher";

interface SearchHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function SearchHeader({
  title,
  description,
  icon: Icon,
}: SearchHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <h1 className="font-serif text-2xl text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <ViewSwitcher />
    </div>
  );
}
