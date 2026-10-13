import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function VendorLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#c9d1d9]">
      <header className="flex h-14 items-center justify-between border-b border-white/10 bg-white/[0.02] px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#141a24] font-mono text-[12px] font-semibold text-[#7aa2ff]">
            {"</>"}
          </div>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#7d8590]">
            Vendor console
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#7d8590]">{user?.name}</span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-[12px] text-[#c9d1d9] hover:bg-white/5"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
