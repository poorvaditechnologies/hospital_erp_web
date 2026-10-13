import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Visit, VisitType, KitOrderStatus, MessageStatus } from "@/types";

export interface ReportSummary {
  totalPatients: number;
  visitsToday: number;
  followUpsDue: number;
  swarnaPrashanaDueThisWeek: number;
  pendingKitOrders: number;
  kitRevenueThisMonth?: number;
}

export function useReportSummary() {
  return useQuery({
    queryKey: ["reports", "summary"],
    queryFn: () => api.get<{ summary: ReportSummary }>("/reports/summary"),
    select: (data) => data.summary,
  });
}

export interface DashboardData {
  visitsTrend: { date: string; count: number }[];
  visitTypeBreakdown: { visitType: VisitType; count: number }[];
  kitOrderStatusBreakdown: { status: KitOrderStatus; count: number }[];
  revenueTrend?: { month: string; amount: number }[];
  upcomingFollowUps: (Visit & { patient: { id: string; name: string; phone: string } })[];
  recentVisits: (Visit & { patient: { id: string; name: string } })[];
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => api.get<DashboardData>("/reports/dashboard"),
  });
}

export interface ReportInsights {
  patientGrowth: { month: string; count: number }[];
  messagePerformance: { status: MessageStatus; count: number }[];
}

export function useReportInsights() {
  return useQuery({
    queryKey: ["reports", "insights"],
    queryFn: () => api.get<ReportInsights>("/reports/insights"),
  });
}
