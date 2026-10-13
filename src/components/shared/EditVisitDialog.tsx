import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateVisit } from "@/hooks/useVisits";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { Visit } from "@/types";

const visitEditSchema = z.object({
  complaint: z.string().optional(),
  diagnosis: z.string().optional(),
  prescriptionNotes: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
});

type VisitEditFormValues = z.infer<typeof visitEditSchema>;

export function EditVisitDialog({ visit, patientId }: { visit: Visit; patientId: string }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const updateVisit = useUpdateVisit(patientId);
  const { showToast } = useToast();
  const { register, handleSubmit, reset } = useForm<VisitEditFormValues>({
    resolver: zodResolver(visitEditSchema),
    defaultValues: {
      complaint: visit.complaint ?? "",
      diagnosis: visit.diagnosis ?? "",
      prescriptionNotes: visit.prescriptionNotes ?? "",
      nextFollowUpDate: visit.nextFollowUpDate ? visit.nextFollowUpDate.slice(0, 10) : "",
    },
  });

  async function onSubmit(values: VisitEditFormValues) {
    setServerError(null);
    try {
      await updateVisit.mutateAsync({
        id: visit.id,
        complaint: values.complaint || undefined,
        diagnosis: values.diagnosis || undefined,
        prescriptionNotes: values.prescriptionNotes || undefined,
        nextFollowUpDate: values.nextFollowUpDate
          ? new Date(values.nextFollowUpDate).toISOString()
          : undefined,
      });
      setOpen(false);
      showToast("Visit updated.");
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save changes");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil size={13} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit visit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="edit-visit-complaint">Complaint</Label>
            <Input id="edit-visit-complaint" className="mt-1" {...register("complaint")} />
          </div>
          <div>
            <Label htmlFor="edit-visit-diagnosis">Diagnosis</Label>
            <Input id="edit-visit-diagnosis" className="mt-1" {...register("diagnosis")} />
          </div>
          <div>
            <Label htmlFor="edit-visit-notes">Prescription / notes</Label>
            <Input id="edit-visit-notes" className="mt-1" {...register("prescriptionNotes")} />
          </div>
          <div>
            <Label htmlFor="edit-visit-followup">Next follow-up date</Label>
            <Input
              id="edit-visit-followup"
              type="date"
              className="mt-1"
              {...register("nextFollowUpDate")}
            />
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={updateVisit.isPending}>
            {updateVisit.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
