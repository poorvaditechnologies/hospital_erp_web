import { useState } from "react";
import { Package, Ban, MoreVertical, Truck, CheckCircle2, IndianRupee } from "lucide-react";
import { useKitOrders, useUpdateKitOrder } from "@/hooks/useKitOrders";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AddKitOrderDialog } from "@/components/shared/AddKitOrderDialog";
import { EditKitOrderDialog } from "@/components/shared/EditKitOrderDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/lib/toast-context";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { KitOrder, KitOrderStatus } from "@/types";

const statusTone: Record<KitOrderStatus, "success" | "pending" | "error" | "neutral"> = {
  PLACED: "pending",
  SHIPPED: "neutral",
  DELIVERED: "success",
  CANCELLED: "error",
};

const paymentTone: Record<string, "success" | "pending" | "error"> = {
  PAID: "success",
  PENDING: "pending",
  FAILED: "error",
};

export function KitOrders() {
  const { data: kitOrders, isLoading, isError } = useKitOrders();
  const updateOrder = useUpdateKitOrder();
  const { showToast } = useToast();
  const [orderToCancel, setOrderToCancel] = useState<KitOrder | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function handleCancelConfirmed() {
    if (!orderToCancel) return;
    try {
      await updateOrder.mutateAsync({ id: orderToCancel.id, status: "CANCELLED" });
      showToast("Order cancelled.");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not cancel order", "error");
    }
  }

  function markShipped(order: KitOrder) {
    updateOrder.mutate({ id: order.id, status: "SHIPPED" });
    showToast("Order marked as shipped.");
    setOpenMenuId(null);
  }

  function markDelivered(order: KitOrder) {
    updateOrder.mutate({ id: order.id, status: "DELIVERED" });
    showToast("Order marked as delivered.");
    setOpenMenuId(null);
  }

  function markPaid(order: KitOrder) {
    updateOrder.mutate({ id: order.id, paymentStatus: "PAID" });
    showToast("Payment marked as paid.");
    setOpenMenuId(null);
  }

  return (
    <div>
      <PageHeader
        title="Kit orders"
        subtitle="Swarna Prashana kit sales shipped directly to customers."
        action={<AddKitOrderDialog />}
      />

      <Card className="overflow-hidden">
        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {isError && (
          <p className="p-5 text-[13px] text-status-error">Could not load kit orders — try again.</p>
        )}
        {kitOrders && kitOrders.length === 0 && (
          <EmptyState
            icon={Package}
            title="No kit orders yet"
            description="Swarna Prashana kit sales will show up here once the first order comes in."
          />
        )}
        {kitOrders && kitOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="px-5 py-3">Items</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {kitOrders.map((order) => {
                  const canEdit = order.status === "PLACED";
                  const canShip = order.status === "PLACED";
                  const canDeliver = order.status === "SHIPPED";
                  const canMarkPaid = order.paymentStatus === "PENDING";
                  const canCancel = order.status === "PLACED" || order.status === "SHIPPED";
                  const hasActions = canEdit || canShip || canDeliver || canMarkPaid || canCancel;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border/70 transition-colors last:border-b-0 hover:bg-bg-app"
                    >
                      <td className="px-5 py-3.5 text-text-primary">
                        {order.items} × {order.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">
                        {order.patient ? (
                          <>
                            <div className="text-text-primary">{order.patient.name}</div>
                            <div className="text-[12px] tabular-nums">{order.patient.phone}</div>
                          </>
                        ) : (
                          "Guest order"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums font-medium text-text-primary">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          label={order.paymentStatus.toLowerCase()}
                          tone={paymentTone[order.paymentStatus]}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge label={order.status.toLowerCase()} tone={statusTone[order.status]} />
                      </td>
                      <td className="px-4 py-3.5">
                        {hasActions && (
                          <div className="relative flex justify-end">
                            <button
                              type="button"
                              onClick={() => setOpenMenuId((prev) => (prev === order.id ? null : order.id))}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-app hover:text-text-primary"
                              aria-label="Order actions"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === order.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-bg-surface py-1 shadow-[var(--shadow-dropdown)]">
                                  {canEdit && (
                                    <div onClick={() => setOpenMenuId(null)}>
                                      <EditKitOrderDialog order={order} asMenuItem />
                                    </div>
                                  )}
                                  {canShip && (
                                    <MenuItem icon={Truck} label="Mark shipped" onClick={() => markShipped(order)} />
                                  )}
                                  {canDeliver && (
                                    <MenuItem
                                      icon={CheckCircle2}
                                      label="Mark delivered"
                                      onClick={() => markDelivered(order)}
                                    />
                                  )}
                                  {canMarkPaid && (
                                    <MenuItem icon={IndianRupee} label="Mark paid" onClick={() => markPaid(order)} />
                                  )}
                                  {canCancel && (
                                    <MenuItem
                                      icon={Ban}
                                      label="Cancel order"
                                      tone="destructive"
                                      onClick={() => {
                                        setOrderToCancel(order);
                                        setOpenMenuId(null);
                                      }}
                                    />
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={orderToCancel !== null}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
        title="Cancel this order?"
        description={`The order for "${orderToCancel?.items}" will be marked as cancelled. This can't be undone.`}
        confirmLabel="Cancel order"
        tone="destructive"
        onConfirm={handleCancelConfirmed}
      />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  tone?: "destructive";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-bg-app",
        tone === "destructive" ? "text-status-error" : "text-text-primary",
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
