import type { LucideIcon } from "lucide-react";
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
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${iconBgClass}`}>
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1
              className={`bg-linear-to-r font-bold text-2xl ${titleGradient} bg-clip-text text-transparent`}
            >
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </div>
      <ViewSwitcher />
    </div>
  );
}
