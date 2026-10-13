import { useState } from "react";
import { Search, Send, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePatients } from "@/hooks/usePatients";
import { useSendTemplate } from "@/hooks/useTemplates";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { cn } from "@/lib/utils";
import type { WhatsAppTemplate } from "@/types";

const avatarTints = [
  "bg-[#eef2ff] text-[#4338ca]",
  "bg-[#ecfdf5] text-[#047857]",
  "bg-[#fff7ed] text-[#c2410c]",
  "bg-[#fdf2f8] text-[#be185d]",
  "bg-[#f0f9ff] text-[#0369a1]",
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function tintFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % avatarTints.length;
  return avatarTints[hash];
}

export function SendTemplateDialog({ template }: { template: WhatsAppTemplate }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [serverError, setServerError] = useState<string | null>(null);
  const { data, isLoading } = usePatients({ search: search || undefined, pageSize: 50 });
  const patients = data?.patients ?? [];
  const sendTemplate = useSendTemplate(template.id);
  const { showToast } = useToast();

  const allSelected = patients.length > 0 && patients.every((p) => selected.has(p.id));
  const someSelected = patients.some((p) => selected.has(p.id)) && !allSelected;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (allSelected) {
        const next = new Set(prev);
        patients.forEach((p) => next.delete(p.id));
        return next;
      }
      const next = new Set(prev);
      patients.forEach((p) => next.add(p.id));
      return next;
    });
  }

  async function handleSend() {
    setServerError(null);
    try {
      const res = await sendTemplate.mutateAsync(Array.from(selected));
      setSelected(new Set());
      setOpen(false);
      showToast(`Sent to ${res.logs.length} patient${res.logs.length === 1 ? "" : "s"}.`);
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not send template");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSelected(new Set());
          setSearch("");
          setServerError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Send size={13} />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send "{template.name}"</DialogTitle>
        </DialogHeader>

        <div className="relative mb-3">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            placeholder="Search patients by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-bg-surface px-3 pl-8 text-sm text-text-primary placeholder:text-text-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          {patients.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2.5 border-b border-border bg-bg-app px-3 py-2 text-[13px] font-medium text-text-primary">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                className="h-4 w-4 accent-[color:var(--color-accent-primary)]"
              />
              Select all
              <span className="ml-auto text-text-secondary">{patients.length} patients</span>
            </label>
          )}

          <div className="max-h-56 overflow-y-auto">
            {isLoading && <p className="p-3 text-[13px] text-text-secondary">Loading patients…</p>}
            {!isLoading && patients.length === 0 && (
              <EmptyState
                icon={Users}
                title="No patients found"
                description={search ? `No match for "${search}".` : "Add patients to send them messages."}
              />
            )}
            {patients.map((patient) => (
              <label
                key={patient.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border-b border-border/60 px-3 py-2 text-sm last:border-b-0 transition-colors",
                  selected.has(patient.id) ? "bg-accent-soft" : "hover:bg-bg-app",
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(patient.id)}
                  onChange={() => toggle(patient.id)}
                  className="h-4 w-4 shrink-0 accent-[color:var(--color-accent-primary)]"
                />
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    tintFor(patient.id),
                  )}
                >
                  {initialsOf(patient.name)}
                </div>
                <span className="min-w-0 flex-1 truncate text-text-primary">{patient.name}</span>
                <span className="shrink-0 tabular-nums text-text-secondary">{patient.phone}</span>
              </label>
            ))}
          </div>
        </div>

        {serverError && <p className="mt-3 text-[13px] text-status-error">{serverError}</p>}

        <Button
          className="mt-4 w-full"
          disabled={selected.size === 0 || sendTemplate.isPending}
          onClick={handleSend}
        >
          <Send size={14} />
          {sendTemplate.isPending
            ? "Sending…"
            : `Send to ${selected.size} patient${selected.size === 1 ? "" : "s"}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
