import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, checked = false, ...props }, ref) => (
    <div
      ref={ref}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "h-4 w-4 shrink-0 rounded border border-primary transition-colors flex items-center justify-center",
        checked ? "bg-primary text-primary-foreground" : "bg-card text-transparent",
        className
      )}
      {...props}
    >
      <Check className={cn("h-3 w-3 stroke-[3]", checked ? "opacity-100" : "opacity-0")} />
    </div>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
