import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onBack: () => void;
}

export function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  // Move focus to the reset heading when the view opens.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function onSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatus("idle");
    try {
      // UI-only flow: no password-reset endpoint exists in this project, so no
      // request is made. Replace with a real API call once the backend ships one.
      await new Promise((resolve) => setTimeout(resolve, 400));
      setStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-xl font-bold text-text-primary focus:outline-none"
      >
        Reset your password
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
        Enter the email registered to your staff account and we'll prepare a reset request for
        your clinic administrator.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="reset-email">Email address</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="name@clinic.com"
            className="mt-1.5 h-10"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "reset-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="reset-email-error" className="mt-1.5 text-[12px] text-status-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div aria-live="polite">
          {status === "success" && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-[13px] text-status-success">
              This preview doesn't send email yet — no reset link was sent. Contact your clinic
              admin directly to reset your password.
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-auth-primary text-white hover:bg-auth-primary-hover focus-visible:outline-auth-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 border-t border-auth-border pt-5">
        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={onBack}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back to sign in
        </Button>
        <p className="mt-3 text-center text-[12px] text-text-secondary">
          Need help? Contact your clinic admin
        </p>
      </div>
    </>
  );
}