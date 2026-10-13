import { useVendorClinics } from "@/hooks/useVendor";

export function Vendor() {
  const { data: clinics, isLoading, isError } = useVendorClinics();

  return (
    <div>
      <h1 className="font-mono text-[13px] uppercase tracking-[0.1em] text-[#7d8590]">Tenants</h1>
      <p className="mt-2 text-2xl font-semibold text-white">All clinics on the platform</p>
      <p className="mt-1 text-[13px] text-[#7d8590]">
        Every clinic tenant, with usage at a glance. Read-only for now.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {isLoading && <p className="p-5 text-[13px] text-[#7d8590]">Loading clinics…</p>}
        {isError && <p className="p-5 text-[13px] text-[#ffa198]">Could not load clinics.</p>}
        {clinics && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left font-mono text-[11px] uppercase tracking-wide text-[#7d8590]">
                <th className="px-5 py-3 font-medium">Clinic</th>
                <th className="py-3 font-medium">Plan</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Staff</th>
                <th className="py-3 font-medium">Patients</th>
                <th className="px-5 py-3 font-medium">Visits</th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{clinic.name}</div>
                    <div className="font-mono text-[12px] tabular-nums text-[#7d8590]">
                      {clinic.phone}
                    </div>
                  </td>
                  <td className="py-3 capitalize text-[#c9d1d9]">{clinic.subscriptionPlan}</td>
                  <td className="py-3">
                    <span
                      className={
                        clinic.subscriptionStatus === "active"
                          ? "inline-flex items-center rounded-full bg-[#3fb950]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#3fb950]"
                          : "inline-flex items-center rounded-full bg-[#d29922]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#d29922]"
                      }
                    >
                      {clinic.subscriptionStatus}
                    </span>
                  </td>
                  <td className="py-3 tabular-nums text-[#c9d1d9]">{clinic.staffCount}</td>
                  <td className="py-3 tabular-nums text-[#c9d1d9]">{clinic.patientCount}</td>
                  <td className="px-5 py-3 tabular-nums text-[#c9d1d9]">{clinic.visitCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
