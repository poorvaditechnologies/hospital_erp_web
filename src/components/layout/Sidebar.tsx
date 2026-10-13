import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  MessageCircleMore,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/kit-orders", label: "Kit orders", icon: Package },
  { to: "/templates", label: "Templates", icon: MessageCircleMore },
  { to: "/reports", label: "Reports", icon: BarChart3, adminOnly: true },
  { to: "/staff", label: "Staff", icon: UserCog, adminOnly: true },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border bg-bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary font-display text-[13px] font-bold text-white">
          J
        </div>
        <div>
          <div className="font-display text-[14px] font-bold leading-tight tracking-tight text-text-primary">
            Clinic Manager
          </div>
          <div className="text-[11px] text-text-secondary">Ayurveda practice suite</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-accent-soft text-accent-primary"
                    : "text-text-secondary hover:bg-bg-app hover:text-text-primary",
                )
              }
            >
              <item.icon size={16} strokeWidth={2} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="border-t border-border p-3">
        {isAdmin && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium",
                isActive
                  ? "bg-accent-soft text-accent-primary"
                  : "text-text-secondary hover:bg-bg-app hover:text-text-primary",
              )
            }
          >
            <SettingsIcon size={16} strokeWidth={2} />
            Settings
          </NavLink>
        )}

        <div className="relative">
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => logout()}
                className="absolute bottom-full left-0 z-20 mb-1.5 flex w-full items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2 text-left text-[13px] font-medium text-status-error shadow-[var(--shadow-dropdown)] hover:bg-bg-app"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-bg-app"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary text-[11px] font-semibold text-white">
              {user ? initialsOf(user.name) : ""}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-text-primary">{user?.name}</div>
              <div className="text-[11px] text-text-secondary">
                {user?.role === "ADMIN" ? "Admin" : user?.role === "DOCTOR" ? "Doctor" : "Front desk"}
              </div>
            </div>
            <ChevronsUpDown size={14} className="shrink-0 text-text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
}
