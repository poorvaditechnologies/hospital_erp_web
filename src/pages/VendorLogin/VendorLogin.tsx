import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";

export function VendorLogin() {
  const { login, logout } = useAuth();
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
      const user = await login(phone, password);
      if (!user.isSuperAdmin) {
        await logout();
        setError("This account doesn't have vendor console access. Use the staff sign-in instead.");
        return;
      }
      navigate("/vendor");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not sign in — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e14] px-6 text-[#c9d1d9]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 0%, rgba(99,141,255,0.14), transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_1px_1px_rgba(0,0,0,0.4),0_24px_48px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#141a24] font-mono text-[13px] font-semibold text-[#7aa2ff]">
            {"</>"}
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#7d8590]">
              Platform ops
            </div>
            <div className="text-[14px] font-semibold text-white">Vendor console</div>
          </div>
        </div>

        <p className="mb-6 text-[13px] leading-relaxed text-[#7d8590]">
          Internal access for the team operating the Clinic Manager platform across all tenant
          clinics. Not for clinic staff — they sign in from their own clinic's login page.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="vphone" className="font-mono text-[11px] uppercase tracking-wide text-[#7d8590]">
              Phone
            </label>
            <input
              id="vphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
              className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 font-mono text-sm text-white outline-none placeholder:text-[#4b535d] focus-visible:border-[#7aa2ff]/60 focus-visible:ring-1 focus-visible:ring-[#7aa2ff]/40"
              placeholder="9999999999"
            />
          </div>
          <div>
            <label
              htmlFor="vpassword"
              className="font-mono text-[11px] uppercase tracking-wide text-[#7d8590]"
            >
              Password
            </label>
            <input
              id="vpassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 font-mono text-sm text-white outline-none placeholder:text-[#4b535d] focus-visible:border-[#7aa2ff]/60 focus-visible:ring-1 focus-visible:ring-[#7aa2ff]/40"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-[#f85149]/20 bg-[#f85149]/10 px-3 py-2 text-[12px] text-[#ffa198]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-lg bg-[#7aa2ff] text-[13px] font-semibold text-[#0a0e14] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating…" : "Access console"}
          </button>
        </form>

        <p className="mt-6 font-mono text-[11px] text-[#4b535d]">clinic-manager // internal-ops</p>
      </div>
    </div>
  );
}
