export function Footer() {
  return (
    <footer className="border-t border-auth-border px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-2 text-[12px] leading-relaxed text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p>Protected by Enterprise SSO &amp; MFA • Multi-tenant Healthcare Cloud</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
          <span>ISO 27001 Certified</span>
          <span>Audit Trail Logging Enabled</span>
          <span>© 2025 AyuDent Care Technologies Pvt Ltd</span>
        </div>
      </div>
    </footer>
  );
}