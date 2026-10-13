import { Link } from "react-router-dom";
import {
  CalendarClock,
  Sparkles,
  Package,
  Users2,
  IndianRupee,
  UserPlus,
  MessageCircleMore,
  ShoppingBag,
  TrendingUp,
  PieChart,
  BarChart2,
  Inbox,
} from "lucide-react";
import { useReportSummary, useDashboardData } from "@/hooks/useReports";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { BarTrendChart } from "@/components/charts/BarTrendChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { StatusBreakdownBars } from "@/components/charts/StatusBreakdownBars";
import { RevenueLineChart } from "@/components/charts/RevenueLineChart";
import { cn } from "@/lib/utils";
import type { VisitType, KitOrderStatus } from "@/types";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const visitTypeLabels: Record<VisitType, string> = {
  SWARNA_PRASHANA: "Swarna Prashana",
  WALKIN: "Walk-in",
  CHECKUP: "Checkup / follow-up",
};

// Categorical slots — fixed order, not cycled (see dataviz palette)
const visitTypeColors: Record<VisitType, string> = {
  SWARNA_PRASHANA: "#2a78d6",
  WALKIN: "#eb6834",
  CHECKUP: "#1baf7a",
};

const kitStatusLabels: Record<KitOrderStatus, string> = {
  PLACED: "Placed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Semantic status colors, reused from the app's status palette (not arbitrary categorical hues)
const kitStatusColors: Record<KitOrderStatus, string> = {
  PLACED: "var(--color-accent-muted)",
  SHIPPED: "var(--color-text-secondary)",
  DELIVERED: "var(--color-status-success)",
  CANCELLED: "var(--color-status-error)",
};

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

function relativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.round(diffMs / 3600000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useReportSummary();
  const { data: dashboard, isLoading: isDashboardLoading } = useDashboardData();
  const isAdmin = user?.role === "ADMIN";
  const firstName = user?.name?.split(" ")[0];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-[13px] text-text-secondary">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            · Here's what's happening at the clinic today.
          </p>
        </div>
        <div className="flex gap-2">
          <QuickAction to="/patients" icon={UserPlus} label="New patient" />
          <QuickAction to="/kit-orders" icon={ShoppingBag} label="New order" />
          <QuickAction to="/templates" icon={MessageCircleMore} label="Send message" />
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2",
          isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        <StatBlock
          icon={CalendarClock}
          label="Visits today"
          value={summary?.visitsToday}
          isLoading={isLoading}
          accent
        />
        <StatBlock
          icon={Sparkles}
          label="Swarna Prashana due this week"
          value={summary?.swarnaPrashanaDueThisWeek}
          isLoading={isLoading}
        />
        <StatBlock
          icon={Users2}
          label="Total patients registered"
          value={summary?.totalPatients}
          isLoading={isLoading}
        />
        {isAdmin && (
          <StatBlock
            icon={IndianRupee}
            label="Kit revenue this month"
            value={summary?.kitRevenueThisMonth}
            isLoading={isLoading}
            format="currency"
          />
        )}
      </div>

      {/* Visits trend + visit type breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              Visits, last 14 days
            </h2>
          </div>
          {isDashboardLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : dashboard && dashboard.visitsTrend.some((d) => d.count > 0) ? (
            <BarTrendChart data={dashboard.visitsTrend} />
          ) : (
            <EmptyState icon={BarChart2} title="No visits logged in this window" />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieChart size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              Visit types, last 30 days
            </h2>
          </div>
          {isDashboardLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : dashboard && dashboard.visitTypeBreakdown.length > 0 ? (
            <DonutChart
              slices={dashboard.visitTypeBreakdown.map((v) => ({
                label: visitTypeLabels[v.visitType],
                count: v.count,
                color: visitTypeColors[v.visitType],
              }))}
            />
          ) : (
            <EmptyState icon={PieChart} title="No visits in this window" />
          )}
        </Card>
      </div>

      {/* Kit order status + upcoming follow-ups */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              Kit orders by status
            </h2>
          </div>
          {isDashboardLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : dashboard && dashboard.kitOrderStatusBreakdown.length > 0 ? (
            <StatusBreakdownBars
              bars={dashboard.kitOrderStatusBreakdown.map((s) => ({
                label: kitStatusLabels[s.status],
                count: s.count,
                colorVar: kitStatusColors[s.status],
              }))}
            />
          ) : (
            <EmptyState icon={Package} title="No kit orders yet" />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">
              Upcoming follow-ups
            </h2>
          </div>
          {isDashboardLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : dashboard && dashboard.upcomingFollowUps.length > 0 ? (
            <ul className="divide-y divide-border/70">
              {dashboard.upcomingFollowUps.map((visit) => (
                <li key={visit.id} className="flex items-center justify-between py-2.5">
                  <Link
                    to={`/patients/${visit.patient.id}`}
                    className="text-[13px] font-medium text-text-primary hover:text-accent-primary"
                  >
                    {visit.patient.name}
                  </Link>
                  <span className="text-[12px] font-medium text-accent-muted">
                    {daysUntil(visit.nextFollowUpDate!)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarClock} title="No follow-ups scheduled" />
          )}
        </Card>
      </div>

      {/* Recent activity + revenue trend */}
      <div className={cn("mt-4 grid grid-cols-1 gap-4", isAdmin ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Inbox size={16} className="text-text-secondary" />
            <h2 className="font-display text-[15px] font-semibold text-text-primary">Recent visits</h2>
          </div>
          {isDashboardLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : dashboard && dashboard.recentVisits.length > 0 ? (
            <ul className="divide-y divide-border/70">
              {dashboard.recentVisits.map((visit) => (
                <li key={visit.id} className="flex items-center justify-between py-2.5 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: visitTypeColors[visit.visitType] }}
                    />
                    <Link
                      to={`/patients/${visit.patient.id}`}
                      className="font-medium text-text-primary hover:text-accent-primary"
                    >
                      {visit.patient.name}
                    </Link>
                    <span className="text-text-secondary">{visitTypeLabels[visit.visitType]}</span>
                  </div>
                  <span className="text-[12px] tabular-nums text-text-secondary">
                    {relativeTime(visit.visitDate)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Inbox} title="No visits logged yet" />
          )}
        </Card>

        {isAdmin && (
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-text-secondary" />
              <h2 className="font-display text-[15px] font-semibold text-text-primary">
                Kit revenue, last 6 months
              </h2>
            </div>
            {isDashboardLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : dashboard?.revenueTrend && dashboard.revenueTrend.some((d) => d.amount > 0) ? (
              <RevenueLineChart data={dashboard.revenueTrend} />
            ) : (
              <EmptyState icon={TrendingUp} title="No paid orders in this window" />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3.5 py-2 text-[13px] font-medium text-text-primary shadow-[var(--shadow-card)] transition-colors hover:bg-bg-app"
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </Link>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
  isLoading,
  accent,
  format,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: number | undefined;
  isLoading: boolean;
  accent?: boolean;
  format?: "currency";
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div
            className={
              accent
                ? "font-display text-3xl font-bold tabular-nums text-accent-primary"
                : "font-display text-3xl font-bold tabular-nums text-text-primary"
            }
          >
            {format === "currency" ? `₹${(value ?? 0).toLocaleString("en-IN")}` : value ?? 0}
          </div>
        )}
        <Icon
          size={18}
          strokeWidth={2}
          className={accent ? "text-accent-primary" : "text-text-secondary/50"}
        />
      </div>
      <div className="mt-1.5 text-[13px] text-text-secondary">{label}</div>
    </Card>
  );
}
