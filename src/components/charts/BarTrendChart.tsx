import { useState } from "react";

interface BarTrendChartProps {
  data: { date: string; count: number }[];
  color?: string;
}

const WIDTH = 600;
const HEIGHT = 160;
const PADDING_LEFT = 28;
const PADDING_BOTTOM = 20;
const PADDING_TOP = 12;

export function BarTrendChart({ data, color = "var(--color-accent-primary)" }: BarTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.count));
  const plotWidth = WIDTH - PADDING_LEFT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const slot = plotWidth / data.length;
  const barWidth = Math.min(24, slot - 4);

  const yTicks = [0, Math.ceil(max / 2), max];
  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: HEIGHT }}>
        {yTicks.map((tick) => {
          const y = PADDING_TOP + plotHeight - (tick / max) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text x={0} y={y + 3} fontSize={10} fill="var(--color-text-secondary)">
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const barHeight = (d.count / max) * plotHeight;
          const x = PADDING_LEFT + i * slot + (slot - barWidth) / 2;
          const y = PADDING_TOP + plotHeight - barHeight;
          const isActive = activeIndex === i;
          const label = new Date(d.date).getDate();
          const showDateLabel = i % 2 === 0;

          return (
            <g key={d.date}>
              <rect
                x={x}
                y={Math.max(y, PADDING_TOP)}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx={4}
                fill={isActive ? color : color}
                opacity={isActive ? 1 : 0.75}
                className="transition-opacity"
              />
              <rect
                x={x - 2}
                y={PADDING_TOP}
                width={barWidth + 4}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              />
              {showDateLabel && (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT - 4}
                  fontSize={10}
                  textAnchor="middle"
                  fill="var(--color-text-secondary)"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-bg-surface px-2.5 py-1.5 text-[12px] shadow-[var(--shadow-dropdown)]"
          style={{
            left: `${((PADDING_LEFT + (activeIndex! + 0.5) * slot) / WIDTH) * 100}%`,
          }}
        >
          <div className="font-semibold text-text-primary">{active.count} visits</div>
          <div className="text-text-secondary">
            {new Date(active.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
      )}
    </div>
  );
}
