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
import { useUpdateKitOrder } from "@/hooks/useKitOrders";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { KitOrder } from "@/types";

const kitOrderSchema = z.object({
  items: z.string().min(1, "List the items in this order"),
  quantity: z.coerce.number().int().min(1),
  amount: z.coerce.number().int().min(0),
  shippingAddress: z.string().min(1, "Shipping address is required"),
});

type KitOrderFormValues = z.infer<typeof kitOrderSchema>;

export function EditKitOrderDialog({ order, asMenuItem }: { order: KitOrder; asMenuItem?: boolean }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const updateKitOrder = useUpdateKitOrder();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KitOrderFormValues>({
    resolver: zodResolver(kitOrderSchema),
    defaultValues: {
      items: order.items,
      quantity: order.quantity,
      amount: order.amount,
      shippingAddress: order.shippingAddress,
    },
  });

  async function onSubmit(values: KitOrderFormValues) {
    setServerError(null);
    try {
      await updateKitOrder.mutateAsync({ id: order.id, ...values });
      setOpen(false);
      showToast("Kit order updated.");
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
        {asMenuItem ? (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-text-primary transition-colors hover:bg-bg-app"
          >
            <Pencil size={14} />
            Edit order
          </button>
        ) : (
          <Button size="sm" variant="ghost">
            <Pencil size={13} />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit kit order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="edit-order-items">Items</Label>
            <Input id="edit-order-items" className="mt-1.5" {...register("items")} />
            {errors.items && <p className="mt-1 text-[13px] text-status-error">{errors.items.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-order-quantity">Quantity</Label>
              <Input
                id="edit-order-quantity"
                type="number"
                min={1}
                className="mt-1.5"
                {...register("quantity")}
              />
            </div>
            <div>
              <Label htmlFor="edit-order-amount">Amount (₹)</Label>
              <Input
                id="edit-order-amount"
                type="number"
                min={0}
                className="mt-1.5"
                {...register("amount")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-order-address">Shipping address</Label>
            <Input id="edit-order-address" className="mt-1.5" {...register("shippingAddress")} />
            {errors.shippingAddress && (
              <p className="mt-1 text-[13px] text-status-error">{errors.shippingAddress.message}</p>
            )}
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={updateKitOrder.isPending}>
            {updateKitOrder.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
