import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const ELEMENT_COLORS = {
  Api: 'var(--color-api)',
  Air: 'var(--color-air)',
  Angin: 'var(--color-angin)',
  Tanah: 'var(--color-tanah)',
};

/**
 * PersonaRadarChart — Radar chart 4 elemen kepribadian
 * scores: { API: number, AIR: number, ANGIN: number, TANAH: number }
 */
export default function PersonaRadarChart({ scores }) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 24;

  const data = [
    { element: 'Api 🔥',   score: scores.API || 0,   pct: Math.round(((scores.API || 0) / total) * 100) },
    { element: 'Air 💧',   score: scores.AIR || 0,   pct: Math.round(((scores.AIR || 0) / total) * 100) },
    { element: 'Angin 🍃', score: scores.ANGIN || 0, pct: Math.round(((scores.ANGIN || 0) / total) * 100) },
    { element: 'Tanah 🌿', score: scores.TANAH || 0, pct: Math.round(((scores.TANAH || 0) / total) * 100) },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.625rem 0.875rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: 0 }}>
          {d.element}
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
          {d.score} jawaban · {d.pct}%
        </p>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            gridType="polygon"
            stroke="var(--color-border)"
            strokeDasharray="4 4"
          />
          <PolarAngleAxis
            dataKey="element"
            tick={{
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              fill: 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          />
          <Radar
            name="Skor"
            dataKey="score"
            stroke="var(--color-accent)"
            fill="var(--color-accent)"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 4, fill: 'var(--color-accent)', strokeWidth: 0 }}
          />
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
