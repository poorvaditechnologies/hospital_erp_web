import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Package,
  MessageCircleMore,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
} from "lucide-react";
import type { NavItem } from "@/shared/layout/navItem";

export const clinicAdminNavItems: NavItem[] = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/visits", label: "Visits", icon: CalendarClock },
  { to: "/kit-orders", label: "Kit orders", icon: Package },
  { to: "/templates", label: "Templates", icon: MessageCircleMore },
  { to: "/reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { to: "/staff", label: "Staff", icon: UserCog, adminOnly: true },
  { to: "/settings", label: "Settings", icon: SettingsIcon, adminOnly: true },
];
