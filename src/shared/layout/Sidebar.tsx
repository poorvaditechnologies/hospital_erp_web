import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import type { NavItem } from "./navItem";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface SidebarProps {
  brandTitle: string;
  brandSubtitle: string;
  navItems: NavItem[];
}

export function Sidebar({ brandTitle, brandSubtitle, navItems }: SidebarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);

  const roleLabel = user?.isSuperAdmin
    ? "Super admin"
    : user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "DOCTOR"
        ? "Doctor"
        : "Front desk";

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border bg-bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary font-display text-[13px] font-bold text-white">
          {brandTitle[0]}
        </div>
        <div>
          <div className="font-display text-[14px] font-bold leading-tight tracking-tight text-text-primary">
            {brandTitle}
          </div>
          <div className="text-[11px] text-text-secondary">{brandSubtitle}</div>
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
        <div className="relative">
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => dispatch(logout())}
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
              <div className="text-[11px] text-text-secondary">{roleLabel}</div>
            </div>
            <ChevronsUpDown size={14} className="shrink-0 text-text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
}
