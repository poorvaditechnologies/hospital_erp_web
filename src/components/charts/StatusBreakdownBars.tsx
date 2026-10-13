interface StatusBar {
  label: string;
  count: number;
  colorVar: string;
}

export function StatusBreakdownBars({ bars }: { bars: StatusBar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.count));

  return (
    <div className="space-y-3">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="text-text-primary">{bar.label}</span>
            <span className="font-semibold tabular-nums text-text-primary">{bar.count}</span>
          </div>
          <div className="h-2 rounded-full bg-bg-app">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(bar.count / max) * 100}%`,
                backgroundColor: bar.colorVar,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
