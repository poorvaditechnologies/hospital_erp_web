export type UserRole = "ADMIN" | "FRONT_DESK" | "DOCTOR";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  clinicId: string;
  isSuperAdmin?: boolean;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  dob: string | null;
  gender: Gender | null;
  email: string | null;
  bloodGroup: string | null;
  guardianName: string | null;
  address: string | null;
  createdAt: string;
}

export type VisitType = "SWARNA_PRASHANA" | "WALKIN" | "CHECKUP";
export type NotesVisibility = "DOCTOR_ONLY" | "ALL_STAFF";

export interface Visit {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string | null;
  visitType: VisitType;
  visitDate: string;
  complaint: string | null;
  diagnosis: string | null;
  prescriptionNotes: string | null;
  nextFollowUpDate: string | null;
  notesVisibility: NotesVisibility;
  createdAt: string;
}

export type TemplateCategory = "UTILITY" | "MARKETING" | "AUTHENTICATION";
export type TemplateApprovalStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface WhatsAppTemplate {
  id: string;
  clinicId: string;
  name: string;
  category: TemplateCategory;
  bodyText: string;
  variables: string | null;
  approvalStatus: TemplateApprovalStatus;
  metaTemplateId: string | null;
  createdAt: string;
}

export type MessageStatus = "SENT" | "DELIVERED" | "FAILED";

export interface WhatsAppMessageLog {
  id: string;
  clinicId: string;
  patientId: string;
  templateId: string;
  triggeredBy: string;
  status: MessageStatus;
  sentAt: string;
  patient?: { name: string; phone: string };
  template?: { name: string };
}

export type KitOrderStatus = "PLACED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type KitOrderPaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface KitOrder {
  id: string;
  clinicId: string;
  patientId: string | null;
  items: string;
  quantity: number;
  amount: number;
  paymentStatus: KitOrderPaymentStatus;
  status: KitOrderStatus;
  shippingAddress: string;
  orderDate: string;
  shippedDate: string | null;
  patient?: { name: string; phone: string } | null;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
}

export interface VendorClinic {
  id: string;
  name: string;
  phone: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
  staffCount: number;
  patientCount: number;
  visitCount: number;
}

export interface ApiError {
  error: { code: string; message: string };
}
