import { useState } from "react";
import { Users, UserX, UserCheck } from "lucide-react";
import { useStaff, useUpdateStaffRole, useSetStaffActive } from "@/hooks/useStaff";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AddStaffDialog } from "@/components/shared/AddStaffDialog";
import { EditStaffDialog } from "@/components/shared/EditStaffDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { ApiRequestError } from "@/lib/api";
import type { StaffMember, UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  FRONT_DESK: "Front desk",
  DOCTOR: "Doctor",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Staff() {
  const { user } = useAuth();
  const { data: staff, isLoading, isError } = useStaff();
  const updateRole = useUpdateStaffRole();
  const setActive = useSetStaffActive();
  const { showToast } = useToast();
  const [memberToDeactivate, setMemberToDeactivate] = useState<StaffMember | null>(null);

  async function handleDeactivateConfirmed() {
    if (!memberToDeactivate) return;
    try {
      await setActive.mutateAsync({ id: memberToDeactivate.id, isActive: false });
      showToast(`${memberToDeactivate.name}'s access was revoked.`);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not deactivate account", "error");
    }
  }

  async function handleReactivate(member: StaffMember) {
    try {
      await setActive.mutateAsync({ id: member.id, isActive: true });
      showToast(`${member.name}'s access was restored.`);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Could not reactivate account", "error");
    }
  }

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage who can access this clinic."
        action={<AddStaffDialog />}
      />

      <Card className="overflow-hidden">
        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="ml-auto h-8 w-32" />
              </div>
            ))}
          </div>
        )}
        {isError && <p className="p-5 text-[13px] text-status-error">Could not load staff.</p>}
        {staff && staff.length === 0 && (
          <EmptyState
            icon={Users}
            title="No staff accounts yet"
            description="Add your front desk and doctor accounts so they can sign in."
          />
        )}
        {staff && staff.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[12px] font-medium uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-3">Name</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border/70 transition-colors last:border-b-0 hover:bg-bg-app"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary text-[11px] font-semibold text-white">
                        {initialsOf(member.name)}
                      </div>
                      <span className="font-medium text-text-primary">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 tabular-nums text-text-primary">{member.phone}</td>
                  <td className="py-3 text-text-secondary">{member.email ?? "—"}</td>
                  <td className="py-3">
                    {member.id === user?.id ? (
                      <span className="text-[13px] text-text-secondary">{roleLabels[member.role]}</span>
                    ) : (
                      <Select
                        className="h-8 w-36 text-[13px]"
                        value={member.role}
                        disabled={!member.isActive}
                        onChange={(e) => {
                          updateRole.mutate({ id: member.id, role: e.target.value as UserRole });
                          showToast(
                            `${member.name}'s role updated to ${roleLabels[e.target.value as UserRole]}.`,
                          );
                        }}
                      >
                        <option value="FRONT_DESK">Front desk</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMIN">Admin</option>
                      </Select>
                    )}
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      label={member.isActive ? "Active" : "Deactivated"}
                      tone={member.isActive ? "success" : "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <EditStaffDialog member={member} />
                      {member.id !== user?.id &&
                        (member.isActive ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-status-error hover:text-status-error"
                            onClick={() => setMemberToDeactivate(member)}
                          >
                            <UserX size={13} />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={setActive.isPending}
                            onClick={() => handleReactivate(member)}
                          >
                            <UserCheck size={13} />
                            Reactivate
                          </Button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <ConfirmDialog
        open={memberToDeactivate !== null}
        onOpenChange={(open) => !open && setMemberToDeactivate(null)}
        title="Deactivate this account?"
        description={`${memberToDeactivate?.name} won't be able to sign in until you reactivate their account. Their history stays intact.`}
        confirmLabel="Deactivate"
        tone="destructive"
        onConfirm={handleDeactivateConfirmed}
      />
    </div>
  );
}
