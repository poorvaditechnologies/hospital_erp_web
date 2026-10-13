import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NotesVisibility, Visit, VisitType } from "@/types";

export interface CreateVisitInput {
  visitType: VisitType;
  complaint?: string;
  diagnosis?: string;
  prescriptionNotes?: string;
  nextFollowUpDate?: string;
  notesVisibility?: NotesVisibility;
}

export function useVisits(patientId: string | undefined) {
  return useQuery({
    queryKey: ["visits", patientId],
    queryFn: () => api.get<{ visits: Visit[] }>(`/patients/${patientId}/visits`),
    select: (data) => data.visits,
    enabled: !!patientId,
  });
}

export function useCreateVisit(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVisitInput) =>
      api.post<{ visit: Visit }>(`/patients/${patientId}/visits`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits", patientId] }),
  });
}

export interface UpdateVisitInput {
  complaint?: string;
  diagnosis?: string;
  prescriptionNotes?: string;
  nextFollowUpDate?: string;
  notesVisibility?: NotesVisibility;
}

export function useUpdateVisit(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateVisitInput & { id: string }) =>
      api.patch<{ visit: Visit }>(`/visits/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits", patientId] }),
  });
}
