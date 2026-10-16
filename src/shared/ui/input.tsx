import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
