import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Card = forwardRef<HTMLElement, CardProps>(
  ({ className, as: Component = "div", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("flat-card rounded-2xl shadow-[var(--shadow-card)]", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";
