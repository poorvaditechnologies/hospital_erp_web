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
import { Select } from "@/components/ui/select";
import { useUpdatePatient } from "@/hooks/usePatients";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { Patient } from "@/types";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone number is required"),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).optional(),
  bloodGroup: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  guardianName: z.string().optional(),
  address: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export function EditPatientDialog({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const updatePatient = useUpdatePatient(patient.id);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient.name,
      phone: patient.phone,
      dob: patient.dob ? patient.dob.slice(0, 10) : "",
      gender: patient.gender ?? "",
      bloodGroup: patient.bloodGroup ?? "",
      email: patient.email ?? "",
      guardianName: patient.guardianName ?? "",
      address: patient.address ?? "",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    setServerError(null);
    try {
      await updatePatient.mutateAsync({
        ...values,
        gender: values.gender || undefined,
        email: values.email || undefined,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
      });
      setOpen(false);
      showToast("Patient details updated.");
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
        <Button size="sm" variant="secondary">
          <Pencil size={13} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          <div>
            <Label htmlFor="edit-name">Full name</Label>
            <Input id="edit-name" className="mt-1" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone number</Label>
            <Input id="edit-phone" className="mt-1" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-[13px] text-status-error">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-dob">Date of birth</Label>
              <Input id="edit-dob" type="date" className="mt-1" {...register("dob")} />
            </div>
            <div>
              <Label htmlFor="edit-gender">Gender</Label>
              <Select id="edit-gender" className="mt-1" {...register("gender")}>
                <option value="">Not specified</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-bloodGroup">Blood group</Label>
              <Input id="edit-bloodGroup" className="mt-1" placeholder="O+" {...register("bloodGroup")} />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" className="mt-1" {...register("email")} />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-guardianName">Guardian name (if child)</Label>
            <Input id="edit-guardianName" className="mt-1" {...register("guardianName")} />
          </div>
          <div>
            <Label htmlFor="edit-address">Address</Label>
            <Input id="edit-address" className="mt-1" {...register("address")} />
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={updatePatient.isPending}>
            {updatePatient.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
