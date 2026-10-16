import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function RequireAdminRole() {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet />;
}
