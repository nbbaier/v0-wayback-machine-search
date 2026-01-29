"use client";

import { LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const views = [
  {
    name: "Cards",
    href: "/cards",
    icon: LayoutGrid,
  },
  {
    name: "Timeline",
    href: "/timeline",
    icon: Sparkles,
  },
];

export function ViewSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = pathname === view.href;
        const href = urlParam
          ? `${view.href}?url=${encodeURIComponent(urlParam)}`
          : view.href;

        return (
          <Link
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
            href={href}
            key={view.href}
            prefetch={true}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{view.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
