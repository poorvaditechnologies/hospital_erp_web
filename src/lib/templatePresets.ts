import type { TemplateCategory } from "@/types";

export interface TemplatePreset {
  id: string;
  label: string;
  category: TemplateCategory;
  name: string;
  bodyText: string;
}

export const templatePresets: TemplatePreset[] = [
  {
    id: "swarna-reminder",
    label: "Swarna Prashana reminder",
    category: "UTILITY",
    name: "swarna_prashana_reminder",
    bodyText: "Hi {{1}}, your Swarna Prashana dose is due tomorrow at Jataveda Ayurvedic Clinic.",
  },
  {
    id: "follow-up-reminder",
    label: "Follow-up reminder",
    category: "UTILITY",
    name: "follow_up_reminder",
    bodyText:
      "Hi {{1}}, your follow-up visit at Jataveda Ayurvedic Clinic is due on {{2}}. Reply to confirm your slot.",
  },
  {
    id: "appointment-confirmation",
    label: "Appointment confirmation",
    category: "UTILITY",
    name: "appointment_confirmation",
    bodyText: "Hi {{1}}, your appointment at Jataveda Ayurvedic Clinic is confirmed for {{2}}.",
  },
  {
    id: "kit-order-shipped",
    label: "Kit order shipped",
    category: "UTILITY",
    name: "kit_order_shipped",
    bodyText:
      "Hi {{1}}, your Swarna Prashana kit order has been shipped and should arrive soon. Thank you for choosing Jataveda Ayurvedic Clinic.",
  },
  {
    id: "payment-reminder",
    label: "Payment reminder",
    category: "UTILITY",
    name: "payment_reminder",
    bodyText:
      "Hi {{1}}, your payment of {{2}} for your recent order at Jataveda Ayurvedic Clinic is pending. Please complete it at your earliest convenience.",
  },
  {
    id: "promotional-offer",
    label: "Promotional offer",
    category: "MARKETING",
    name: "monthly_offer",
    bodyText:
      "Hi {{1}}, this month enjoy a special offer on Swarna Prashana kit orders at Jataveda Ayurvedic Clinic. Order now!",
  },
];
