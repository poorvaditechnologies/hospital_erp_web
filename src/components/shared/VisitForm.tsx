import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateVisit } from "@/hooks/useVisits";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { VisitType } from "@/types";

const visitSchema = z.object({
  visitType: z.enum(["SWARNA_PRASHANA", "WALKIN", "CHECKUP"]),
  complaint: z.string().optional(),
  diagnosis: z.string().optional(),
  prescriptionNotes: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

const visitTypeOptions: { value: VisitType; label: string }[] = [
  { value: "SWARNA_PRASHANA", label: "Swarna Prashana" },
  { value: "WALKIN", label: "Walk-in" },
  { value: "CHECKUP", label: "Checkup / follow-up" },
];

export function VisitForm({ patientId, onSaved }: { patientId: string; onSaved?: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const createVisit = useCreateVisit(patientId);
  const { showToast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: { visitType: "WALKIN" },
  });

  async function onSubmit(values: VisitFormValues) {
    setServerError(null);
    try {
      await createVisit.mutateAsync({
        visitType: values.visitType,
        complaint: values.complaint || undefined,
        diagnosis: values.diagnosis || undefined,
        prescriptionNotes: values.prescriptionNotes || undefined,
        nextFollowUpDate: values.nextFollowUpDate
          ? new Date(values.nextFollowUpDate).toISOString()
          : undefined,
      });
      reset({ visitType: "WALKIN" });
      showToast("Visit logged.");
      onSaved?.();
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save visit");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flat-card space-y-3 rounded-2xl p-5 shadow-[var(--shadow-card)]"
    >
      <div>
        <Label htmlFor="visitType">Visit type</Label>
        <Controller
          name="visitType"
          control={control}
          render={({ field }) => (
            <Select id="visitType" className="mt-1.5" {...field}>
              {visitTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="complaint">Complaint</Label>
        <Input id="complaint" className="mt-1" {...register("complaint")} />
      </div>
      <div>
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Input id="diagnosis" className="mt-1" {...register("diagnosis")} />
      </div>
      <div>
        <Label htmlFor="prescriptionNotes">Prescription / notes</Label>
        <Input id="prescriptionNotes" className="mt-1" {...register("prescriptionNotes")} />
      </div>
      <div>
        <Label htmlFor="nextFollowUpDate">Next follow-up date</Label>
        <Input id="nextFollowUpDate" type="date" className="mt-1" {...register("nextFollowUpDate")} />
      </div>

      {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

      <Button type="submit" disabled={createVisit.isPending}>
        {createVisit.isPending ? "Saving…" : "Save visit"}
      </Button>
    </form>
  );
}
