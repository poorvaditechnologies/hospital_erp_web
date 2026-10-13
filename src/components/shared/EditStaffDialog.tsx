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
import { useUpdateStaff } from "@/hooks/useStaff";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { StaffMember } from "@/types";

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export function EditStaffDialog({ member }: { member: StaffMember }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const updateStaff = useUpdateStaff(member.id);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: member.name, phone: member.phone, email: member.email ?? "" },
  });

  async function onSubmit(values: StaffFormValues) {
    setServerError(null);
    try {
      await updateStaff.mutateAsync({ ...values, email: values.email || undefined });
      setOpen(false);
      showToast("Staff details updated.");
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
          <DialogTitle>Edit staff account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="edit-staff-name">Full name</Label>
            <Input id="edit-staff-name" className="mt-1.5" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-staff-phone">Phone number</Label>
            <Input id="edit-staff-phone" className="mt-1.5" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-[13px] text-status-error">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-staff-email">Email (optional)</Label>
            <Input id="edit-staff-email" type="email" className="mt-1.5" {...register("email")} />
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={updateStaff.isPending}>
            {updateStaff.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
