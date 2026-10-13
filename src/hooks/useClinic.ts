import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Clinic } from "@/types";

export interface UpdateClinicInput {
  name?: string;
  phone?: string;
  address?: string;
}

export function useClinic() {
  return useQuery({
    queryKey: ["clinic"],
    queryFn: () => api.get<{ clinic: Clinic }>("/clinic"),
    select: (data) => data.clinic,
  });
}

export function useUpdateClinic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateClinicInput) => api.patch<{ clinic: Clinic }>("/clinic", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clinic"] }),
  });
}
