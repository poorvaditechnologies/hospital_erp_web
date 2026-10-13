import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KitOrder, KitOrderPaymentStatus, KitOrderStatus } from "@/types";

export interface CreateKitOrderInput {
  patientId?: string;
  items: string;
  quantity: number;
  amount: number;
  shippingAddress: string;
}

export function useKitOrders() {
  return useQuery({
    queryKey: ["kitOrders"],
    queryFn: () => api.get<{ kitOrders: KitOrder[] }>("/kit-orders"),
    select: (data) => data.kitOrders,
  });
}

export function useCreateKitOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateKitOrderInput) => api.post<{ kitOrder: KitOrder }>("/kit-orders", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kitOrders"] }),
  });
}

export interface UpdateKitOrderInput {
  items?: string;
  quantity?: number;
  amount?: number;
  shippingAddress?: string;
  status?: KitOrderStatus;
  paymentStatus?: KitOrderPaymentStatus;
}

export function useUpdateKitOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateKitOrderInput & { id: string }) =>
      api.patch<{ kitOrder: KitOrder }>(`/kit-orders/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kitOrders"] }),
  });
}
