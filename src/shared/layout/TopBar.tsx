interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-bg-surface px-6">
      <span className="font-display text-[15px] font-semibold text-text-primary">{title}</span>
    </header>
  );
}
