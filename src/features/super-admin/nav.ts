import { LayoutDashboard, Building2, CreditCard, Settings as SettingsIcon } from "lucide-react";
import type { NavItem } from "@/shared/layout/navItem";

export const superAdminNavItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/clinics", label: "Clinics", icon: Building2 },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];
