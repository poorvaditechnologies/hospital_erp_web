import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { restoreSession } from "@/features/auth/authSlice";
import { Login } from "@/features/auth/pages/Login";
import { clinicAdminNavItems } from "@/features/clinic-admin/nav";
import { Dashboard as ClinicDashboard } from "@/features/clinic-admin/pages/Dashboard";
import { Patients } from "@/features/clinic-admin/pages/Patients";
import { Visits } from "@/features/clinic-admin/pages/Visits";
import { KitOrders } from "@/features/clinic-admin/pages/KitOrders";
import { Templates } from "@/features/clinic-admin/pages/Templates";
import { Staff } from "@/features/clinic-admin/pages/Staff";
import { Reports } from "@/features/clinic-admin/pages/Reports";
import { Settings as ClinicSettings } from "@/features/clinic-admin/pages/Settings";
import { superAdminNavItems } from "@/features/super-admin/nav";
import { Dashboard as SuperAdminDashboard } from "@/features/super-admin/pages/Dashboard";
import { Clinics } from "@/features/super-admin/pages/Clinics";
import { Subscriptions } from "@/features/super-admin/pages/Subscriptions";
import { Settings as SuperAdminSettings } from "@/features/super-admin/pages/Settings";
import { ToastProvider } from "@/lib/toast-context";
import { DashboardLayout } from "@/shared/layout/DashboardLayout";
import { RequireAuth, RequireClinicUser, RequireSuperAdmin } from "@/shared/guards/RequireAuth";
import { RequireAdminRole } from "@/shared/guards/RequireAdminRole";

const queryClient = new QueryClient();

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        {/* Clinic staff — admin, front desk & doctor share one login, role decides what they see */}
        <Route element={<RequireClinicUser />}>
          <Route
            element={
              <DashboardLayout
                brandTitle="Clinic Manager"
                brandSubtitle="Ayurveda practice suite"
                topBarTitle="Clinic Manager"
                navItems={clinicAdminNavItems}
              />
            }
          >
            <Route path="/" element={<ClinicDashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/kit-orders" element={<KitOrders />} />
            <Route path="/templates" element={<Templates />} />
            <Route element={<RequireAdminRole />}>
              <Route path="/reports" element={<Reports />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/settings" element={<ClinicSettings />} />
            </Route>
          </Route>
        </Route>

        {/* Platform super admin — manages clinics/subscriptions across the whole product */}
        <Route element={<RequireSuperAdmin />}>
          <Route
            element={
              <DashboardLayout
                brandTitle="Platform Console"
                brandSubtitle="Super admin"
                topBarTitle="Platform Console"
                navItems={superAdminNavItems}
              />
            }
          >
            <Route path="/admin" element={<SuperAdminDashboard />} />
            <Route path="/admin/clinics" element={<Clinics />} />
            <Route path="/admin/subscriptions" element={<Subscriptions />} />
            <Route path="/admin/settings" element={<SuperAdminSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SessionBootstrap>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SessionBootstrap>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
}
