import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Login } from "@/pages/Login/Login";
import { VendorLogin } from "@/pages/VendorLogin/VendorLogin";
import { Dashboard } from "@/pages/Dashboard/Dashboard";
import { PatientsList } from "@/pages/Patients/PatientsList";
import { KitOrders } from "@/pages/KitOrders/KitOrders";
import { Templates } from "@/pages/Templates/Templates";
import { Reports } from "@/pages/Reports/Reports";
import { Staff } from "@/pages/Staff/Staff";
import { Settings } from "@/pages/Settings/Settings";
import { Vendor } from "@/pages/Vendor/Vendor";
import { AdminRoute } from "@/components/shared/AdminRoute";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-app text-[13px] text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <AppLayout />;
}

function VendorProtectedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e14] text-[13px] text-[#7d8590]">
        Loading…
      </div>
    );
  }

  if (!user?.isSuperAdmin) return <Navigate to="/vendor/login" replace />;

  return <VendorLayout />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Clinic staff — admin & front desk share one login, role decides what they see */}
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<PatientsList />} />
                <Route path="/patients/:id" element={<PatientsList />} />
                <Route path="/kit-orders" element={<KitOrders />} />
                <Route path="/templates" element={<Templates />} />
                <Route
                  path="/reports"
                  element={
                    <AdminRoute>
                      <Reports />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <AdminRoute>
                      <Staff />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AdminRoute>
                      <Settings />
                    </AdminRoute>
                  }
                />
              </Route>

              {/* Vendor console — fully separate login and layout, never linked from clinic screens */}
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route element={<VendorProtectedRoutes />}>
                <Route path="/vendor" element={<Vendor />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
