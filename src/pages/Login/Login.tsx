import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(phone, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not sign in — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="glass-dark relative hidden w-[46%] shrink-0 flex-col justify-between overflow-hidden p-12 text-text-on-sidebar lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(560px 420px at 15% 10%, color-mix(in oklab, var(--gradient-accent-from) 55%, transparent), transparent 65%), radial-gradient(480px 420px at 100% 100%, color-mix(in oklab, var(--color-accent-muted) 30%, transparent), transparent 70%)",
          }}
        />

        <BotanicalMark className="pointer-events-none absolute -bottom-20 -right-16 h-96 w-96 text-white/[0.06]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-display text-base font-bold">
            J
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Clinic Manager
          </span>
        </div>

        <div className="relative">
          <BotanicalMark className="mb-8 h-12 w-12 text-accent-muted/80" />
          <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight">
            Jataveda
            <br />
            Ayurvedic Clinic
          </h1>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-text-on-sidebar/65">
            Swarna Prashana schedules, patient histories, and kit orders — one system for the whole
            front desk.
          </p>
        </div>

        <p className="relative text-[12px] text-text-on-sidebar/40">
          © {new Date().getFullYear()} Jataveda Ayurvedic Clinic · Staff access only
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center bg-bg-app px-6 py-12">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "radial-gradient(700px 460px at 10% -10%, color-mix(in oklab, var(--gradient-accent-from) 14%, transparent), transparent 60%)",
          }}
        />

        <div className="relative w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(155deg,var(--gradient-accent-from),var(--gradient-accent-to))] font-display text-base font-bold text-white shadow-[var(--shadow-neu)]">
              J
            </div>
            <h1 className="font-display text-xl font-bold text-text-primary">
              Jataveda Ayurvedic Clinic
            </h1>
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary">Welcome back</h2>
          <p className="mt-1.5 text-[13px] text-text-secondary">Sign in with your staff account.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                className="mt-1.5"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9999999999"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-status-error/10 px-3 py-2 text-[13px] text-status-error">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-[12px] text-text-secondary">
            Lost your password? Ask a clinic admin to reset it from Staff settings.
          </p>
        </div>
      </div>
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
