import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  Phone,
  Mail,
  MapPin,
  CalendarClock,
  ClipboardList,
  Droplet,
  Cake,
} from "lucide-react";
import { usePatients, usePatient } from "@/hooks/usePatients";
import { useVisits } from "@/hooks/useVisits";
import { VisitForm } from "@/components/shared/VisitForm";
import { AddPatientDialog } from "@/components/shared/AddPatientDialog";
import { EditPatientDialog } from "@/components/shared/EditPatientDialog";
import { EditVisitDialog } from "@/components/shared/EditVisitDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Gender } from "@/types";

const PAGE_SIZE = 8;

const visitTypeLabels: Record<string, string> = {
  SWARNA_PRASHANA: "Swarna Prashana",
  WALKIN: "Walk-in",
  CHECKUP: "Checkup / follow-up",
};

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

const genderLabels: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const genderShort: Record<Gender, string> = {
  MALE: "M",
  FEMALE: "F",
  OTHER: "O",
};

function ageOf(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function PatientsList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const { data, isLoading, isError, isPlaceholderData } = usePatients({
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const patients = data?.patients;
  const pagination = data?.pagination;

  function updateParams(next: { search?: string; page?: number }) {
    const params: Record<string, string> = {};
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? page;
    if (nextSearch) params.search = nextSearch;
    if (nextPage > 1) params.page = String(nextPage);
    setSearchParams(params);
  }

  const selectedId = id ?? patients?.[0]?.id;

  function patientHref(patientId: string) {
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (page > 1) qs.set("page", String(page));
    const suffix = qs.toString();
    return `/patients/${patientId}${suffix ? `?${suffix}` : ""}`;
  }

  // No patient selected yet — land on the most recently added one on this page.
  useEffect(() => {
    if (!id && patients && patients.length > 0) {
      navigate(patientHref(patients[0].id), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, patients, navigate]);

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle={isLoading ? "Loading…" : `${pagination?.total ?? 0} registered`}
        action={<AddPatientDialog />}
      />

      <div className="relative mb-4 max-w-xs">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
          className="h-9 w-full rounded-lg border border-border bg-bg-surface px-3 pl-8 text-sm text-text-primary placeholder:text-text-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
        />
      </div>

      <div className="flex flex-col gap-4 lg:h-[calc(100vh-232px)] lg:flex-row">
        {/* List panel */}
        <Card className="flex flex-col overflow-hidden p-0 lg:w-[60%] lg:shrink-0">
          <div className={cn("flex-1 overflow-y-auto", isPlaceholderData && "opacity-60")}>
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-[1] border-b border-border bg-bg-surface text-left text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="w-10 px-3 py-2.5">#</th>
                  <th className="px-3 py-2.5">Patient</th>
                  <th className="px-3 py-2.5">Age / Gender</th>
                  <th className="px-3 py-2.5">Blood group</th>
                </tr>
              </thead>
              <tbody>
                {patients?.map((patient, index) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(patientHref(patient.id))}
                    className={cn(
                      "cursor-pointer border-b border-border/60 transition-colors last:border-b-0",
                      patient.id === selectedId ? "bg-accent-soft" : "hover:bg-bg-app",
                    )}
                  >
                    <td className="px-3 py-2.5 tabular-nums text-text-secondary">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                            tintFor(patient.id),
                          )}
                        >
                          {initialsOf(patient.name)}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "truncate text-[13px] font-medium",
                              patient.id === selectedId ? "text-accent-primary" : "text-text-primary",
                            )}
                          >
                            {patient.name}
                          </div>
                          <div className="truncate text-[12px] tabular-nums text-text-secondary">
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-text-secondary">
                      {patient.dob ? `${ageOf(patient.dob)}y` : "—"}
                      {patient.gender ? ` · ${genderShort[patient.gender]}` : ""}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-text-secondary">
                      {patient.bloodGroup ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && (
              <div className="space-y-3 p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            )}
            {isError && <p className="p-4 text-[13px] text-status-error">Could not load patients.</p>}
            {patients && patients.length === 0 && (
              <EmptyState
                icon={Users}
                title={search ? "No matches" : "No patients yet"}
                description={
                  search ? `No patient found for "${search}".` : "Add the first patient to get started."
                }
              />
            )}
          </div>

          {pagination && pagination.total > 0 && (
            <Pagination pagination={pagination} onPageChange={(next) => updateParams({ page: next })} />
          )}
        </Card>

        {/* Detail panel */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {patients && patients.length === 0 ? (
            <Card className="h-full p-5">
              <EmptyState
                icon={Users}
                title="No patient selected"
                description="Add a patient to see their details here."
              />
            </Card>
          ) : (
            <PatientDetailPanel patientId={selectedId} />
          )}
        </div>
      </div>
    </div>
  );
}

function PatientDetailPanel({ patientId }: { patientId: string | undefined }) {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: visits, isLoading: visitsLoading } = useVisits(patientId);

  useEffect(() => {
    setShowVisitForm(false);
  }, [patientId]);

  if (patientLoading || !patientId) {
    return (
      <Card className="flex items-center gap-4 p-5">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </Card>
    );
  }
  if (!patient) return <p className="text-[13px] text-status-error">Patient not found.</p>;

  return (
    <div>
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-primary font-display text-lg font-bold text-white">
            {initialsOf(patient.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-bold text-text-primary">{patient.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Phone size={13} />
                {patient.phone}
              </span>
              {patient.dob && (
                <span className="flex items-center gap-1.5">
                  <Cake size={13} />
                  {ageOf(patient.dob)} yrs ({new Date(patient.dob).toLocaleDateString("en-IN")})
                </span>
              )}
              {patient.gender && <span>{genderLabels[patient.gender]}</span>}
              {patient.bloodGroup && (
                <span className="flex items-center gap-1.5">
                  <Droplet size={13} />
                  {patient.bloodGroup}
                </span>
              )}
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} />
                  {patient.email}
                </span>
              )}
              {patient.guardianName && (
                <span className="flex items-center gap-1.5">
                  <Users size={13} />
                  Guardian: {patient.guardianName}
                </span>
              )}
              {patient.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {patient.address}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <EditPatientDialog patient={patient} />
            <Button size="sm" onClick={() => setShowVisitForm((v) => !v)}>
              {showVisitForm ? "Cancel" : "Log new visit"}
            </Button>
          </div>
        </div>
      </Card>

      {showVisitForm && (
        <div className="mt-4">
          <VisitForm patientId={patient.id} onSaved={() => setShowVisitForm(false)} />
        </div>
      )}

      <h2 className="mb-3 mt-6 font-display text-base font-semibold text-text-primary">
        Visit history
      </h2>

      {visitsLoading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      )}
      {visits && visits.length === 0 && (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="No visits logged yet"
            description="Log the first visit to start this patient's history."
          />
        </Card>
      )}
      {visits && visits.length > 0 && (
        <ul className="space-y-3">
          {visits.map((visit) => (
            <Card as="li" key={visit.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  {visitTypeLabels[visit.visitType]}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[13px] tabular-nums text-text-secondary">
                    <CalendarClock size={13} />
                    {new Date(visit.visitDate).toLocaleDateString("en-IN")}
                  </span>
                  <EditVisitDialog visit={visit} patientId={patient.id} />
                </div>
              </div>
              {visit.complaint && (
                <p className="mt-1.5 text-[13px] text-text-secondary">Complaint: {visit.complaint}</p>
              )}
              {visit.diagnosis && (
                <p className="mt-1 text-[13px] text-text-secondary">Diagnosis: {visit.diagnosis}</p>
              )}
              {visit.prescriptionNotes && (
                <p className="mt-1 text-[13px] text-text-secondary">Notes: {visit.prescriptionNotes}</p>
              )}
              {visit.nextFollowUpDate && (
                <p className="mt-1.5 text-[13px] font-medium text-accent-muted">
                  Next follow-up: {new Date(visit.nextFollowUpDate).toLocaleDateString("en-IN")}
                </p>
              )}
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
