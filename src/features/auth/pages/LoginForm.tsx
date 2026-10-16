import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAppDispatch } from "@/app/hooks";
import { login } from "@/features/auth/authSlice";
import { ApiRequestError } from "@/lib/api";
import { ResetPasswordForm } from "./ResetPasswordForm";

const loginSchema = z.object({
  branchCode: z.string().trim().optional(),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
  trust: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type View = "signin" | "reset";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signinHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousView = useRef<View>("signin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { branchCode: "", phone: "", password: "", trust: false },
  });

  // Move focus to the sign-in heading when returning from the reset view (skip initial mount).
  useEffect(() => {
    if (previousView.current !== view) {
      previousView.current = view;
      if (view === "signin") signinHeadingRef.current?.focus();
    }
  }, [view]);

  async function onSubmit(values: LoginFormValues) {
    if (isSubmitting) return;
    setServerError(null);
    setIsSubmitting(true);
    try {
      // branchCode and trust are UI-only for now: the /auth/login contract takes
      // phone + password only, so they are not transmitted.
      const user = await dispatch(login({ phone: values.phone, password: values.password })).unwrap();
      navigate(user.isSuperAdmin ? "/admin" : "/");
    } catch (err) {
      setServerError(
        err instanceof ApiRequestError ? err.message : "Could not sign in — try again",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-7 w-full max-w-md rounded-lg border border-auth-border bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      {view === "reset" ? (
        <ResetPasswordForm onBack={() => setView("signin")} />
      ) : (
        <>
          <h3
            ref={signinHeadingRef}
            tabIndex={-1}
            className="font-display text-xl font-bold text-text-primary focus:outline-none"
          >
            Sign in
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
            Enter your staff credentials to access your clinic portal
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="branchCode">Clinic branch code</Label>
                <span className="text-[12px] text-text-secondary">Optional if default</span>
              </div>
              <Input
                id="branchCode"
                type="text"
                autoComplete="off"
                placeholder="e.g. AYU-DEL-04"
                className="mt-1.5 h-10"
                {...register("branchCode")}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="username"
                placeholder="9000000000"
                className="mt-1.5 h-10"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1.5 text-[12px] text-status-error">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="password">Password</Label>
                <span className="text-[12px] text-text-secondary">Min. 8 characters</span>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10 pr-10"
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-auth-primary"
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-[12px] text-status-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            <label
              htmlFor="trust"
              className="flex cursor-pointer items-start gap-2.5 text-[13px] text-text-secondary"
            >
              <input
                id="trust"
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-auth-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-auth-primary"
                {...register("trust")}
              />
              <span>Trust this clinical workstation (12h session)</span>
            </label>

            {serverError && (
              <p
                role="alert"
                className="rounded-lg bg-status-error/10 px-3 py-2 text-[13px] text-status-error"
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-auth-primary text-white hover:bg-auth-primary-hover focus-visible:outline-auth-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in →"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-text-secondary">
            <button
              type="button"
              onClick={() => setView("reset")}
              className="rounded font-medium text-auth-primary underline underline-offset-2 hover:text-auth-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-auth-primary"
            >
              Forgot password?
            </button>{" "}
            Contact your clinic admin
          </p>

          <div className="mt-6 border-t border-auth-border pt-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px flex-1 bg-auth-border" />
              <span className="text-[12px] font-medium text-text-secondary">
                Authorized personnel only
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-auth-border" />
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-auth-border bg-auth-surface p-3">
              <ShieldCheck
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-auth-primary"
              />
              <p className="text-[12px] leading-relaxed text-text-secondary">
                Staff access accounts are provisioned exclusively by clinic administrators.
                Self-registration is restricted.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
