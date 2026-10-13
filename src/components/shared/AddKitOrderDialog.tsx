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
import { useCreateKitOrder } from "@/hooks/useKitOrders";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const kitOrderSchema = z.object({
  items: z.string().min(1, "List the items in this order"),
  quantity: z.coerce.number().int().min(1),
  amount: z.coerce.number().int().min(0),
  shippingAddress: z.string().min(1, "Shipping address is required"),
});

type KitOrderFormValues = z.infer<typeof kitOrderSchema>;

export function AddKitOrderDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const createKitOrder = useCreateKitOrder();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KitOrderFormValues>({
    resolver: zodResolver(kitOrderSchema),
    defaultValues: { quantity: 1, amount: 499 },
  });

  async function onSubmit(values: KitOrderFormValues) {
    setServerError(null);
    try {
      await createKitOrder.mutateAsync(values);
      reset({ quantity: 1, amount: 499, items: "", shippingAddress: "" });
      setOpen(false);
      showToast("Kit order created.");
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save order");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">+ New order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Swarna Prashana kit order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="items">Items</Label>
            <Input
              id="items"
              className="mt-1.5"
              placeholder="Swarna Prashana kit x1"
              {...register("items")}
            />
            {errors.items && <p className="mt-1 text-[13px] text-status-error">{errors.items.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min={1} className="mt-1.5" {...register("quantity")} />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" min={0} className="mt-1.5" {...register("amount")} />
            </div>
          </div>
          <div>
            <Label htmlFor="shippingAddress">Shipping address</Label>
            <Input id="shippingAddress" className="mt-1.5" {...register("shippingAddress")} />
            {errors.shippingAddress && (
              <p className="mt-1 text-[13px] text-status-error">{errors.shippingAddress.message}</p>
            )}
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={createKitOrder.isPending}>
            {createKitOrder.isPending ? "Saving…" : "Save order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
