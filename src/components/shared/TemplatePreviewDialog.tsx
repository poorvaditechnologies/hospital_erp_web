import { useState } from "react";
import { Smartphone, Monitor, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsAppTemplate } from "@/types";

const SAMPLE_VALUES = ["Rahul Sharma", "tomorrow, 10:00 AM", "Jataveda Ayurvedic Clinic", "₹499"];

function renderBody(bodyText: string) {
  return bodyText.replace(/\{\{\s*(\d+)\s*\}\}/g, (_match, index) => {
    const i = Number(index) - 1;
    return SAMPLE_VALUES[i] ?? `[value ${index}]`;
  });
}

function currentTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function TemplatePreviewDialog({ template }: { template: WhatsAppTemplate }) {
  const [view, setView] = useState<"mobile" | "web">("mobile");
  const message = renderBody(template.bodyText);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye size={14} />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview "{template.name}"</DialogTitle>
        </DialogHeader>

        <div className="mb-4 inline-flex rounded-lg border border-border bg-bg-app/60 p-1">
          <button
            type="button"
            onClick={() => setView("mobile")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              view === "mobile" ? "bg-bg-surface text-text-primary shadow-sm" : "text-text-secondary",
            )}
          >
            <Smartphone size={14} />
            WhatsApp mobile
          </button>
          <button
            type="button"
            onClick={() => setView("web")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              view === "web" ? "bg-bg-surface text-text-primary shadow-sm" : "text-text-secondary",
            )}
          >
            <Monitor size={14} />
            WhatsApp Web
          </button>
        </div>

        {view === "mobile" ? <MobilePreview message={message} /> : <WebPreview message={message} />}

        <p className="mt-4 text-[12px] text-text-secondary">
          Sample values shown in place of <code className="rounded bg-bg-app px-1 py-0.5">{"{{1}}"}</code>
          , <code className="rounded bg-bg-app px-1 py-0.5">{"{{2}}"}</code> etc. — actual messages use
          real patient and clinic details.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function MobilePreview({ message }: { message: string }) {
  return (
    <div className="mx-auto w-[300px] overflow-hidden rounded-[28px] border-[6px] border-[#1c1c1c] bg-black shadow-[var(--shadow-raised)]">
      <div className="flex items-center gap-2.5 bg-[#075e54] px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[13px] font-semibold text-white">
          JA
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-white">Jataveda Ayurvedic Clinic</div>
          <div className="text-[11px] text-white/70">Business account</div>
        </div>
      </div>
      <div
        className="flex min-h-[280px] flex-col justify-end gap-2 px-2.5 py-3"
        style={{
          backgroundColor: "#e5ddd5",
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 8px 8px",
        }}
      >
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-2.5 py-2 shadow-sm">
          <p className="whitespace-pre-wrap text-[13px] leading-snug text-[#111b21]">{message}</p>
          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-[10px] text-[#667781]">{currentTime()}</span>
            <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
              <path
                d="M1 5.5 4 8.5 10 1.5"
                stroke="#53bdeb"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 5.5 9 8.5 15 1.5"
                stroke="#53bdeb"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2">
        <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[12px] text-[#8696a0]">Message</div>
      </div>
    </div>
  );
}

function WebPreview({ message }: { message: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-raised)]">
      <div className="flex h-[340px]">
        <div className="hidden w-[220px] shrink-0 border-r border-[#d1d7db] bg-[#f0f2f5] sm:block">
          <div className="border-b border-[#d1d7db] bg-white px-3 py-3 text-[13px] font-medium text-[#111b21]">
            Chats
          </div>
          <div className="flex items-center gap-2.5 bg-[#f0f2f5] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075e54] text-[12px] font-semibold text-white">
              JA
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-[#111b21]">
                Jataveda Ayurvedic Clinic
              </div>
              <div className="truncate text-[11px] text-[#667781]">Business account</div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2.5 border-b border-[#d1d7db] bg-[#f0f2f5] px-4 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#075e54] text-[11px] font-semibold text-white">
              JA
            </div>
            <div className="text-[13px] font-medium text-[#111b21]">Jataveda Ayurvedic Clinic</div>
          </div>
          <div
            className="flex flex-1 flex-col justify-end gap-2 px-4 py-3"
            style={{ backgroundColor: "#efeae2" }}
          >
            <div className="ml-auto max-w-[70%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 shadow-sm">
              <p className="whitespace-pre-wrap text-[13px] leading-snug text-[#111b21]">{message}</p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <span className="text-[10px] text-[#667781]">{currentTime()}</span>
                <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
                  <path
                    d="M1 5.5 4 8.5 10 1.5"
                    stroke="#53bdeb"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 5.5 9 8.5 15 1.5"
                    stroke="#53bdeb"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
