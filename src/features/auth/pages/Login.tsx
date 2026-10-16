import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Header } from "./Header";
import { LoginForm } from "./LoginForm";
import { PartitionInfo } from "./PartitionInfo";
import { Footer } from "./Footer";

export function Login() {
  const user = useAppSelector((state) => state.auth.user);

  if (user) return <Navigate to={user.isSuperAdmin ? "/admin" : "/"} replace />;

  return (
    <div className="flex min-h-screen flex-col bg-auth-outer">
      {/* Full-width status bar */}
      <Header />

      {/* Login content centers in the space between the status bar and the footer */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-9 sm:px-8 sm:py-12">
        {/* Centered clinic branding */}
        <div className="flex flex-col items-center text-center">
          <BotanicalMark className="h-10 w-10 text-auth-primary" />
          <p className="mt-3 font-display text-lg font-semibold text-text-primary">
            Jataveda Ayurvedic Clinic
          </p>
          <p className="mt-1 text-xs text-text-secondary">Clinical management platform</p>
        </div>

        <LoginForm />
        <PartitionInfo />
      </main>

      {/* Footer stays at the bottom of the viewport when content is short */}
      <Footer />
    </div>
  );
}

function BotanicalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 92c0-30-4-46-4-46s16 4 24 20c6 12 2 26 2 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M46 46S30 42 22 26C16 14 20 4 20 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M50 92c0-38 8-56 8-56s-18 2-28-12c-8-11-6-24-6-24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
