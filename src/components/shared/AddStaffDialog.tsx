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
import { useCreateStaff } from "@/hooks/useStaff";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "FRONT_DESK", "DOCTOR"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export function AddStaffDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const createStaff = useCreateStaff();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: "FRONT_DESK" },
  });

  async function onSubmit(values: StaffFormValues) {
    setServerError(null);
    try {
      await createStaff.mutateAsync({ ...values, email: values.email || undefined });
      reset({ role: "FRONT_DESK", name: "", phone: "", email: "", password: "" });
      setOpen(false);
      showToast(`${values.name} added to staff.`);
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not create staff account");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">+ Add staff</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add staff account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="mt-1.5" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" className="mt-1.5" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-[13px] text-status-error">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" className="mt-1.5" {...register("email")} />
          </div>
          <div>
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" type="password" className="mt-1.5" {...register("password")} />
            {errors.password && (
              <p className="mt-1 text-[13px] text-status-error">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select id="role" className="mt-1.5" {...register("role")}>
              <option value="FRONT_DESK">Front desk</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={createStaff.isPending}>
            {createStaff.isPending ? "Saving…" : "Create account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
