import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full min-w-0 border-0 border-border border-b bg-transparent px-0 py-2 text-base outline-none transition-colors selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary",
        "aria-invalid:border-destructive",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
