import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { StaffMember, UserRole } from "@/types";

export interface CreateStaffInput {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => api.get<{ staff: StaffMember[] }>("/staff"),
    select: (data) => data.staff,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => api.post<{ staff: StaffMember }>("/staff", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      api.patch<{ staff: StaffMember }>(`/staff/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export interface UpdateStaffInput {
  name?: string;
  phone?: string;
  email?: string;
}

export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStaffInput) => api.patch<{ staff: StaffMember }>(`/staff/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useSetStaffActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch<{ staff: StaffMember }>(`/staff/${id}/active`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}
