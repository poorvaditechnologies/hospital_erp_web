import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
  {
    variants: {
      variant: {
        primary: "bg-accent-primary text-white shadow-[var(--shadow-card)] hover:bg-accent-primary-hover",
        secondary:
          "bg-bg-surface text-text-primary border border-border shadow-[var(--shadow-card)] hover:bg-bg-app",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-black/[0.04]",
        destructive: "bg-status-error text-white hover:brightness-110",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
