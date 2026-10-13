import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { VendorClinic } from "@/types";

export function useVendorClinics() {
  return useQuery({
    queryKey: ["vendor", "clinics"],
    queryFn: () => api.get<{ clinics: VendorClinic[] }>("/super-admin/clinics"),
    select: (data) => data.clinics,
  });
}
