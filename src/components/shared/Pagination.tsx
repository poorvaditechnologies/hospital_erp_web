import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pagination as PaginationData } from "@/hooks/usePatients";

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}) {
  const { page, pageSize, total, totalPages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
      <span className="text-[12px] text-text-secondary">
        {total === 0 ? "No results" : `${from}–${to} of ${total}`}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition-colors",
            page <= 1 ? "opacity-40" : "hover:bg-bg-app hover:text-text-primary",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="min-w-[64px] text-center text-[12px] tabular-nums text-text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition-colors",
            page >= totalPages ? "opacity-40" : "hover:bg-bg-app hover:text-text-primary",
          )}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
