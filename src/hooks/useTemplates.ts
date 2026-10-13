import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TemplateCategory, WhatsAppMessageLog, WhatsAppTemplate } from "@/types";

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  bodyText: string;
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => api.get<{ templates: WhatsAppTemplate[] }>("/templates"),
    select: (data) => data.templates,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTemplateInput) =>
      api.post<{ template: WhatsAppTemplate }>("/templates", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export interface UpdateTemplateInput {
  name?: string;
  category?: TemplateCategory;
  bodyText?: string;
}

export function useUpdateTemplate(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTemplateInput) =>
      api.patch<{ template: WhatsAppTemplate }>(`/templates/${templateId}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => api.delete(`/templates/${templateId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

export function useSendTemplate(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientIds: string[]) =>
      api.post<{ logs: WhatsAppMessageLog[] }>(`/templates/${templateId}/send`, { patientIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messageLogs"] }),
  });
}

export function useMessageLogs() {
  return useQuery({
    queryKey: ["messageLogs"],
    queryFn: () => api.get<{ logs: WhatsAppMessageLog[] }>("/templates/logs/recent"),
    select: (data) => data.logs,
  });
}
