import { useState } from "react";
import { Server } from "lucide-react";

interface DiagnosticRow {
  label: string;
  value: string;
}

export function PartitionInfo() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [rows, setRows] = useState<DiagnosticRow[]>([]);

  // Reports only what the browser itself can observe — no server/API/database claims.
  function openDiagnostics() {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }
    ).connection;
    setRows([
      { label: "Navigator online", value: navigator.onLine ? "Yes" : "No" },
      {
        label: "Connection type",
        value: connection?.effectiveType
          ? connection.effectiveType.toUpperCase()
          : "Not reported by this browser",
      },
      {
        label: "Downlink estimate",
        value: connection?.downlink !== undefined ? `${connection.downlink} Mbps` : "Unknown",
      },
      { label: "Viewport", value: `${window.innerWidth} × ${window.innerHeight} px` },
      { label: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
      { label: "Checked at", value: new Date().toLocaleTimeString() },
    ]);
    setShowDiagnostics(true);
  }

  return (
    <div className="mt-7 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Server size={13} aria-hidden="true" className="shrink-0" />
          <span>
            Partition: <span className="font-medium text-text-primary">IN-SOUTH-1</span>{" "}
            <span className="text-status-success">(Active)</span>
          </span>
        </span>
        <span aria-hidden="true" className="hidden h-3 w-px bg-auth-border sm:block" />
        <button
          type="button"
          aria-expanded={showDiagnostics}
          aria-controls="network-diagnostics"
          onClick={() => (showDiagnostics ? setShowDiagnostics(false) : openDiagnostics())}
          className="rounded underline underline-offset-2 hover:text-auth-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-auth-primary"
        >
          Network diagnostics
        </button>
      </div>

      <div id="network-diagnostics" hidden={!showDiagnostics} className="w-full max-w-md">
        {showDiagnostics && (
          <div className="rounded-lg border border-auth-border bg-white p-4 shadow-[var(--shadow-card)]">
            <h4 className="text-[13px] font-semibold text-text-primary">
              Network diagnostics (browser only)
            </h4>
            <dl className="mt-2 space-y-1.5 text-[12px]">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-text-secondary">{row.label}</dt>
                  <dd className="text-right font-medium text-text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-auth-border pt-2.5 text-[11px] leading-relaxed text-text-secondary">
              Values reported by your browser only. This does not test clinic servers, APIs, or
              databases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}