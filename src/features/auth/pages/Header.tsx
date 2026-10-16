import { useState } from "react";
import { Lock } from "lucide-react";

export function Header() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="border-b border-auth-border bg-white px-4 py-3 text-xs sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex items-center gap-2 font-medium text-text-primary">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-status-success" />
            Platform operational
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-auth-border sm:block" />
          <span className="text-text-secondary">Version: v4.18.2</span>
        </div>

        <div
          className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5"
          onKeyDown={(e) => {
            if (e.key === "Escape") setHelpOpen(false);
          }}
        >
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Lock size={12} aria-hidden="true" className="shrink-0" />
            HIPAA / ABDM Compliant
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-auth-border sm:block" />
          <button
            type="button"
            aria-expanded={helpOpen}
            aria-controls={helpOpen ? "help-desk-note" : undefined}
            onClick={() => setHelpOpen((open) => !open)}
            className="rounded text-text-secondary underline underline-offset-2 hover:text-auth-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-auth-primary"
          >
            Help desk
          </button>

          {helpOpen && (
            <div
              id="help-desk-note"
              role="note"
              className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-auth-border bg-white p-3 text-[12px] leading-relaxed text-text-secondary shadow-[var(--shadow-dropdown)]"
            >
              For sign-in or account issues, contact your clinic administrator — they can reset
              your account or restore access.
            </div>
          )}
        </div>
      </div>
    </header>
  );
}