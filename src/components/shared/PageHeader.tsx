export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-[26px] font-bold leading-tight text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-text-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
