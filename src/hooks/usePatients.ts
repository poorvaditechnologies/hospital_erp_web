import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Gender, Patient } from "@/types";

export interface CreatePatientInput {
  name: string;
  phone: string;
  dob?: string;
  gender?: Gender;
  email?: string;
  bloodGroup?: string;
  guardianName?: string;
  address?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PatientsPage {
  patients: Patient[];
  pagination: Pagination;
}

export function usePatients(options: { search?: string; page?: number; pageSize?: number } = {}) {
  const { search, page = 1, pageSize = 8 } = options;
  return useQuery({
    queryKey: ["patients", search ?? "", page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      return api.get<PatientsPage>(`/patients?${params.toString()}`);
    },
    placeholderData: (previous) => previous,
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => api.get<{ patient: Patient }>(`/patients/${id}`),
    select: (data) => data.patient,
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePatientInput) => api.post<{ patient: Patient }>("/patients", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export interface UpdatePatientInput {
  name?: string;
  phone?: string;
  dob?: string;
  gender?: Gender;
  email?: string;
  bloodGroup?: string;
  guardianName?: string;
  address?: string;
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePatientInput) => api.patch<{ patient: Patient }>(`/patients/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
