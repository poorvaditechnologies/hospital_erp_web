import { useEffect, useState } from "react";
import { useClinic, useUpdateClinic } from "@/hooks/useClinic";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

export function Settings() {
  const { data: clinic, isLoading } = useClinic();
  const updateClinic = useUpdateClinic();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinic) {
      setName(clinic.name);
      setPhone(clinic.phone);
      setAddress(clinic.address ?? "");
    }
  }, [clinic]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await updateClinic.mutateAsync({ name, phone, address });
      showToast("Clinic details saved.");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not save changes");
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Settings" />
        <Card className="max-w-xl space-y-3 p-5">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Branding and clinic details used across the app and message templates."
      />

      <Card className="max-w-xl p-5">
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <Label htmlFor="clinicName">Clinic name</Label>
            <Input id="clinicName" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="clinicPhone">Phone</Label>
            <Input
              id="clinicPhone"
              className="mt-1.5"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clinicAddress">Address</Label>
            <Input
              id="clinicAddress"
              className="mt-1.5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {error && <p className="text-[13px] text-status-error">{error}</p>}

          <Button type="submit" disabled={updateClinic.isPending}>
            {updateClinic.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>

      <Card className="mt-5 max-w-xl p-5">
        <h2 className="font-display text-base font-semibold text-text-primary">
          WhatsApp BSP connection
        </h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          Sending currently runs through a stub adapter so templates and sends can be tested without a
          live BSP account. Set <code className="rounded bg-bg-app px-1 py-0.5">WHATSAPP_API_KEY</code>{" "}
          and <code className="rounded bg-bg-app px-1 py-0.5">WHATSAPP_API_BASE_URL</code> in the
          server environment once an AiSensy or Interakt account is ready — no code changes needed.
        </p>
      </Card>
    </div>
  );
}
