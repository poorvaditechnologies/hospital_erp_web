import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { NavItem } from "./navItem";

interface DashboardLayoutProps {
  brandTitle: string;
  brandSubtitle: string;
  topBarTitle: string;
  navItems: NavItem[];
}

export function DashboardLayout({ brandTitle, brandSubtitle, topBarTitle, navItems }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-bg-surface">
      <Sidebar brandTitle={brandTitle} brandSubtitle={brandSubtitle} navItems={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={topBarTitle} />
        <main className="flex-1 overflow-auto bg-bg-app px-8 py-7">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
