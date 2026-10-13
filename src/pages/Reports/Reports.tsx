import { useState } from "react";
import { Download, TrendingUp, MessageCircleMore, FileSpreadsheet, ClipboardList, Package } from "lucide-react";
import { useReportInsights } from "@/hooks/useReports";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { StatusBreakdownBars } from "@/components/charts/StatusBreakdownBars";
import { downloadCsv } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { MessageStatus } from "@/types";

const messageStatusLabels: Record<MessageStatus, string> = {
  SENT: "Sent",
  DELIVERED: "Delivered",
  FAILED: "Failed",
};

const messageStatusColors: Record<MessageStatus, string> = {
  SENT: "var(--color-text-secondary)",
  DELIVERED: "var(--color-status-success)",
  FAILED: "var(--color-status-error)",
};

const exportOptions = [
  {
    id: "patients",
    label: "Patients",
    description: "Full patient roster — useful for onboarding or migration.",
    path: "/reports/export/patients.csv",
    filename: "patients.csv",
  },
  {
    id: "visits",
    label: "Visits",
    description: "Every visit ever logged, with complaint, diagnosis, and follow-up dates.",
    path: "/reports/export/visits.csv",
    filename: "visits.csv",
  },
  {
    id: "kit-orders",
    label: "Kit orders",
    description: "All Swarna Prashana kit orders, with payment and shipping status.",
    path: "/reports/export/kit-orders.csv",
    filename: "kit-orders.csv",
  },
];

export function Reports() {
  const { data: insights, isLoading } = useReportInsights();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleExport(option: (typeof exportOptions)[number]) {
    setExportingId(option.id);
    try {
      await downloadCsv(option.path, option.filename);
      showToast(`${option.label} exported.`);
    } catch {
      showToast("Could not generate the export.", "error");
    } finally {
      setExportingId(null);
    }
  }

  const messageBars = insights?.messagePerformance.map((m) => ({
    label: messageStatusLabels[m.status],
    count: m.count,
    colorVar: messageStatusColors[m.status],
  }));

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Longer-range trends and data export — the day-to-day view lives on the Dashboard."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              Patient growth, last 6 months
            </h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : insights && insights.patientGrowth.some((d) => d.count > 0) ? (
            <MonthlyBarChart data={insights.patientGrowth} />
          ) : (
            <EmptyState icon={TrendingUp} title="No new patients in this window" />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircleMore size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              WhatsApp delivery, last 30 days
            </h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : messageBars && messageBars.length > 0 ? (
            <StatusBreakdownBars bars={messageBars} />
          ) : (
            <EmptyState icon={MessageCircleMore} title="No messages sent in this window" />
          )}
        </Card>
      </div>

      <h2 className="mb-3 mt-8 font-display text-base font-semibold text-text-primary">
        Data export
      </h2>
      <Card className="divide-y divide-border/70 overflow-hidden">
        {exportOptions.map((option) => (
          <div key={option.id} className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                <ExportIcon id={option.id} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">{option.label}</h3>
                <p className="text-[13px] text-text-secondary">{option.description}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => handleExport(option)}
              disabled={exportingId === option.id}
            >
              <Download size={15} />
              {exportingId === option.id ? "Preparing…" : "Download CSV"}
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ExportIcon({ id }: { id: string }) {
  if (id === "visits") return <ClipboardList size={18} className="text-accent-primary" />;
  if (id === "kit-orders") return <Package size={18} className="text-accent-primary" />;
  return <FileSpreadsheet size={18} className="text-accent-primary" />;
}
