import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateTemplate } from "@/hooks/useTemplates";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { templatePresets } from "@/lib/templatePresets";
import { cn } from "@/lib/utils";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  category: z.enum(["UTILITY", "MARKETING", "AUTHENTICATION"]),
  bodyText: z.string().min(1, "Message body is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const BLANK_DEFAULTS: TemplateFormValues = { name: "", category: "UTILITY", bodyText: "" };

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const createTemplate = useCreateTemplate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: BLANK_DEFAULTS,
  });

  function applyPreset(presetId: string) {
    const preset = templatePresets.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    reset({ name: preset.name, category: preset.category, bodyText: preset.bodyText });
  }

  function startBlank() {
    setSelectedPresetId(null);
    reset(BLANK_DEFAULTS);
  }

  async function onSubmit(values: TemplateFormValues) {
    setServerError(null);
    try {
      await createTemplate.mutateAsync(values);
      reset(BLANK_DEFAULTS);
      setSelectedPresetId(null);
      setOpen(false);
      showToast(`"${values.name}" submitted for approval.`);
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save template");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset(BLANK_DEFAULTS);
          setSelectedPresetId(null);
          setServerError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg">+ New template</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create WhatsApp template</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Label>Start from a template (optional)</Label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={startBlank}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[12px] font-medium transition-colors",
                selectedPresetId === null
                  ? "border-accent-primary bg-accent-soft text-accent-primary"
                  : "border-border text-text-secondary hover:bg-bg-app",
              )}
            >
              <FileText size={14} className="shrink-0" />
              Start blank
            </button>
            {templatePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-left text-[12px] font-medium transition-colors",
                  selectedPresetId === preset.id
                    ? "border-accent-primary bg-accent-soft text-accent-primary"
                    : "border-border text-text-secondary hover:bg-bg-app",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="name">Template name</Label>
            <Input id="name" className="mt-1.5" placeholder="swarna_reminder" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" className="mt-1.5" {...register("category")}>
              <option value="UTILITY">Utility — lowest cost, transactional</option>
              <option value="MARKETING">Marketing — promotions, offers</option>
              <option value="AUTHENTICATION">Authentication — OTPs</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="bodyText">Message body</Label>
            <textarea
              id="bodyText"
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
              placeholder="Hi {{1}}, your Swarna Prashana dose is due tomorrow at Jataveda Ayurvedic Clinic."
              {...register("bodyText")}
            />
            {errors.bodyText && (
              <p className="mt-1 text-[13px] text-status-error">{errors.bodyText.message}</p>
            )}
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <p className="text-[12px] text-text-secondary">
            New templates are submitted for BSP/Meta approval and marked pending until approved.
          </p>

          <Button type="submit" className="w-full" disabled={createTemplate.isPending}>
            {createTemplate.isPending ? "Submitting…" : "Submit for approval"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
