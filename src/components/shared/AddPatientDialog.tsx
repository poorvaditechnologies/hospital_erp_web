import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreatePatient } from "@/hooks/usePatients";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

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

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const createPatient = useCreatePatient();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({ resolver: zodResolver(patientSchema) });

  async function onSubmit(values: PatientFormValues) {
    setServerError(null);
    try {
      await createPatient.mutateAsync({
        ...values,
        gender: values.gender || undefined,
        email: values.email || undefined,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
      });
      reset();
      setOpen(false);
      showToast(`${values.name} was added to patients.`);
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save patient");
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
        <Button size="lg">+ Add patient</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="mt-1" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" className="mt-1" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-[13px] text-status-error">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" className="mt-1" {...register("dob")} />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select id="gender" className="mt-1" {...register("gender")}>
                <option value="">Not specified</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bloodGroup">Blood group</Label>
              <Input id="bloodGroup" className="mt-1" placeholder="O+" {...register("bloodGroup")} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1" {...register("email")} />
            </div>
          </div>
          <div>
            <Label htmlFor="guardianName">Guardian name (if child)</Label>
            <Input id="guardianName" className="mt-1" {...register("guardianName")} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" className="mt-1" {...register("address")} />
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={createPatient.isPending}>
            {createPatient.isPending ? "Saving…" : "Save patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
