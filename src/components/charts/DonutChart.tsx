interface DonutSlice {
  label: string;
  count: number;
  color: string;
}

const SIZE = 140;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEGREES = 3;

export function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const total = slices.reduce((sum, s) => sum + s.count, 0);

  let cumulativeDegrees = -90;

  return (
    <div className="flex items-center gap-6">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
        {total === 0 ? (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={STROKE}
          />
        ) : (
          slices.map((slice) => {
            if (slice.count === 0) return null;
            const fraction = slice.count / total;
            const degrees = fraction * 360 - GAP_DEGREES;
            const dashLength = (degrees / 360) * CIRCUMFERENCE;
            const dashArray = `${Math.max(dashLength, 0)} ${CIRCUMFERENCE}`;
            const rotation = cumulativeDegrees;
            cumulativeDegrees += fraction * 360;

            return (
              <circle
                key={slice.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={slice.color}
                strokeWidth={STROKE}
                strokeDasharray={dashArray}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
              />
            );
          })
        )}
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 4}
          textAnchor="middle"
          fontSize={22}
          fontWeight={700}
          fill="var(--color-text-primary)"
        >
          {total}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 14}
          textAnchor="middle"
          fontSize={10}
          fill="var(--color-text-secondary)"
        >
          visits
        </text>
      </svg>

      <ul className="space-y-2">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-text-primary">{slice.label}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums text-text-primary">
              {slice.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
