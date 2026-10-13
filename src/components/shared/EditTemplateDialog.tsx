import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
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
import { useUpdateTemplate } from "@/hooks/useTemplates";
import { ApiRequestError } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { WhatsAppTemplate } from "@/types";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  category: z.enum(["UTILITY", "MARKETING", "AUTHENTICATION"]),
  bodyText: z.string().min(1, "Message body is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export function EditTemplateDialog({
  template,
  asMenuItem,
}: {
  template: WhatsAppTemplate;
  asMenuItem?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const updateTemplate = useUpdateTemplate(template.id);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template.name,
      category: template.category,
      bodyText: template.bodyText,
    },
  });

  async function onSubmit(values: TemplateFormValues) {
    setServerError(null);
    try {
      await updateTemplate.mutateAsync(values);
      setOpen(false);
      showToast("Template updated.");
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Could not save changes");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {asMenuItem ? (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-text-primary transition-colors hover:bg-bg-app"
          >
            <Pencil size={14} />
            Edit template
          </button>
        ) : (
          <Button size="sm" variant="ghost">
            <Pencil size={13} />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="edit-tpl-name">Template name</Label>
            <Input id="edit-tpl-name" className="mt-1.5" {...register("name")} />
            {errors.name && <p className="mt-1 text-[13px] text-status-error">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="edit-tpl-category">Category</Label>
            <Select id="edit-tpl-category" className="mt-1.5" {...register("category")}>
              <option value="UTILITY">Utility — lowest cost, transactional</option>
              <option value="MARKETING">Marketing — promotions, offers</option>
              <option value="AUTHENTICATION">Authentication — OTPs</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-tpl-body">Message body</Label>
            <textarea
              id="edit-tpl-body"
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
              {...register("bodyText")}
            />
            {errors.bodyText && (
              <p className="mt-1 text-[13px] text-status-error">{errors.bodyText.message}</p>
            )}
          </div>

          {serverError && <p className="text-[13px] text-status-error">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={updateTemplate.isPending}>
            {updateTemplate.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
