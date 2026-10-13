import { useState } from "react";

interface RevenueLineChartProps {
  data: { month: string; amount: number }[];
  color?: string;
}

const WIDTH = 600;
const HEIGHT = 160;
const PADDING_LEFT = 44;
const PADDING_BOTTOM = 20;
const PADDING_TOP = 16;
const PADDING_RIGHT = 12;

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "short" });
}

export function RevenueLineChart({ data, color = "var(--color-accent-muted)" }: RevenueLineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.amount));
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const step = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: PADDING_LEFT + i * step,
    y: PADDING_TOP + plotHeight - (d.amount / max) * plotHeight,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${PADDING_TOP + plotHeight} L ${points[0]?.x ?? 0} ${PADDING_TOP + plotHeight} Z`;

  const yTicks = [0, Math.round(max / 2), max];
  const active = activeIndex !== null ? points[activeIndex] : null;
  const last = points[points.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: HEIGHT }}>
        {yTicks.map((tick) => {
          const y = PADDING_TOP + plotHeight - (tick / max) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH - PADDING_RIGHT}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text x={0} y={y + 3} fontSize={10} fill="var(--color-text-secondary)">
                ₹{tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={color} opacity={0.1} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={p.month}>
            <circle
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 4 : 3}
              fill={color}
              stroke="var(--color-bg-surface)"
              strokeWidth={2}
            />
            <rect
              x={p.x - step / 2}
              y={PADDING_TOP}
              width={step || 20}
              height={plotHeight}
              fill="transparent"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            />
            <text
              x={p.x}
              y={HEIGHT - 4}
              fontSize={10}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
            >
              {monthLabel(p.month)}
            </text>
          </g>
        ))}

        {last && (
          <text
            x={last.x}
            y={last.y - 10}
            fontSize={11}
            fontWeight={700}
            textAnchor="middle"
            fill="var(--color-text-primary)"
          >
            ₹{last.amount.toLocaleString("en-IN")}
          </text>
        )}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-bg-surface px-2.5 py-1.5 text-[12px] shadow-[var(--shadow-dropdown)]"
          style={{ left: `${(active.x / WIDTH) * 100}%` }}
        >
          <div className="font-semibold text-text-primary">₹{active.amount.toLocaleString("en-IN")}</div>
          <div className="text-text-secondary">{monthLabel(active.month)}</div>
        </div>
      )}
    </div>
  );
}
