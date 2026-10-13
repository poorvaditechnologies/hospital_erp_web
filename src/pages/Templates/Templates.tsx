import { useState } from "react";
import { MessageCircleMore, Inbox, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTemplates, useMessageLogs, useDeleteTemplate } from "@/hooks/useTemplates";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CreateTemplateDialog } from "@/components/shared/CreateTemplateDialog";
import { EditTemplateDialog } from "@/components/shared/EditTemplateDialog";
import { SendTemplateDialog } from "@/components/shared/SendTemplateDialog";
import { TemplatePreviewDialog } from "@/components/shared/TemplatePreviewDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/lib/toast-context";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { WhatsAppTemplate } from "@/types";

const categoryLabels: Record<string, string> = {
  UTILITY: "Utility",
  MARKETING: "Marketing",
  AUTHENTICATION: "Authentication",
};

const categoryDot: Record<string, string> = {
  UTILITY: "bg-[#2a78d6]",
  MARKETING: "bg-[#eb6834]",
  AUTHENTICATION: "bg-[#1baf7a]",
};

const approvalTone: Record<string, "success" | "pending" | "error" | "neutral"> = {
  APPROVED: "success",
  PENDING: "pending",
  REJECTED: "error",
  DRAFT: "neutral",
};

export function Templates() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data: templates, isLoading, isError } = useTemplates();
  const { data: logs } = useMessageLogs();
  const deleteTemplate = useDeleteTemplate();
  const { showToast } = useToast();
  const [templateToDelete, setTemplateToDelete] = useState<WhatsAppTemplate | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function handleDeleteConfirmed() {
    if (!templateToDelete) return;
    try {
      await deleteTemplate.mutateAsync(templateToDelete.id);
      showToast(`"${templateToDelete.name}" deleted.`);
    } catch (err) {
      showToast(
        err instanceof ApiRequestError ? err.message : "Could not delete template",
        "error",
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="WhatsApp templates"
        subtitle="Sent via a third-party BSP — categorize correctly, it affects per-message cost."
        action={isAdmin && <CreateTemplateDialog />}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="space-y-3 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </Card>
          ))}
        </div>
      )}
      {isError && (
        <Card className="p-5">
          <p className="text-[13px] text-status-error">Could not load templates — try again.</p>
        </Card>
      )}
      {templates && templates.length === 0 && (
        <Card>
          <EmptyState
            icon={MessageCircleMore}
            title="No templates yet"
            description={
              isAdmin
                ? "Create your first WhatsApp template — a Swarna Prashana reminder is a good place to start."
                : "Ask a clinic admin to create a template so you can start sending reminders."
            }
            action={isAdmin ? <CreateTemplateDialog /> : undefined}
          />
        </Card>
      )}
      {templates && templates.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const canEdit = isAdmin && template.approvalStatus !== "APPROVED";
            const canDelete = isAdmin;

            return (
              <Card key={template.id} className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", categoryDot[template.category])}
                    />
                    <span className="truncate font-medium text-text-primary">{template.name}</span>
                  </div>
                  {(canEdit || canDelete) && (
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === template.id ? null : template.id))
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-app hover:text-text-primary"
                        aria-label="Template actions"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {openMenuId === template.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-bg-surface py-1 shadow-[var(--shadow-dropdown)]">
                            {canEdit && (
                              <div onClick={() => setOpenMenuId(null)}>
                                <EditTemplateDialog template={template} asMenuItem />
                              </div>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTemplateToDelete(template);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-status-error transition-colors hover:bg-bg-app"
                              >
                                <Trash2 size={14} />
                                Delete template
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge
                    label={categoryLabels[template.category]}
                    tone={template.category === "MARKETING" ? "pending" : "neutral"}
                  />
                  <StatusBadge
                    label={template.approvalStatus.toLowerCase()}
                    tone={approvalTone[template.approvalStatus]}
                  />
                </div>

                <p className="mt-3 line-clamp-3 flex-1 rounded-lg bg-bg-app p-2.5 text-[13px] leading-relaxed text-text-secondary">
                  {template.bodyText}
                </p>

                <div className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3">
                  <TemplatePreviewDialog template={template} />
                  <SendTemplateDialog template={template} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <h2 className="mb-3 mt-8 font-display text-base font-semibold text-text-primary">
        Recent sends
      </h2>
      <Card className="overflow-hidden">
        {(!logs || logs.length === 0) && (
          <EmptyState icon={Inbox} title="No messages sent yet" />
        )}
        {logs && logs.length > 0 && (
          <ul className="divide-y divide-border/70">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between px-5 py-2.5 text-sm hover:bg-accent-soft/40"
              >
                <span className="text-text-primary">
                  {log.template?.name} → {log.patient?.name} ({log.patient?.phone})
                </span>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-[12px] text-text-secondary">
                    {new Date(log.sentAt).toLocaleString("en-IN")}
                  </span>
                  <StatusBadge
                    label={log.status.toLowerCase()}
                    tone={log.status === "FAILED" ? "error" : "success"}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={templateToDelete !== null}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        title="Delete template?"
        description={`"${templateToDelete?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete template"
        tone="destructive"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
