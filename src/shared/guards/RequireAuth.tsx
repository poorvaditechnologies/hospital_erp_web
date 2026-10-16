import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function RequireAuth() {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-app text-[13px] text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function RequireSuperAdmin() {
  const user = useAppSelector((state) => state.auth.user);
  if (!user?.isSuperAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function RequireClinicUser() {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.isSuperAdmin) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
