interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 36 }: ScoreRingProps) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? 'var(--color-success)' : score >= 55 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={size * 0.32}
        fontWeight={700}
        fill="var(--color-fg)"
      >
        {score}
      </text>
    </svg>
  );
}
