import { cn } from "@/lib/utils";

type BadgeTone = "success" | "error" | "pending" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-status-success/10 text-status-success",
  error: "bg-status-error/10 text-status-error",
  pending: "bg-accent-muted/10 text-accent-muted",
  neutral: "bg-text-secondary/10 text-text-secondary",
};

const dotClasses: Record<BadgeTone, string> = {
  success: "bg-status-success",
  error: "bg-status-error",
  pending: "bg-accent-muted",
  neutral: "bg-text-secondary",
};

export function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize",
        toneClasses[tone],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
      {label}
    </span>
  );
}
