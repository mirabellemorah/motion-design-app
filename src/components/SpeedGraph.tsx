import { useMemo } from "react";

interface SpeedGraphProps {
  bezier: [number, number, number, number];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

const PADDING = 36;

function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

const SpeedGraph = ({
  bezier,
  width = 320,
  height = 160,
  color = "var(--ae-green)",
  label = "Speed Graph",
}: SpeedGraphProps) => {
  const [x1, y1, x2, y2] = bezier;
  const innerW = width - PADDING * 2;
  const innerH = height - PADDING * 2;

  const { path, fillPath, maxVelocity, peakTime } = useMemo(() => {
    const step = 1 / 150;
    const velocities: { x: number; v: number; t: number }[] = [];

    for (let i = 0; i <= 150; i++) {
      const t = i / 150;
      const tN = Math.min(1, t + step);
      const val = bezierPoint(t, 0, y1, y2, 1);
      const valN = bezierPoint(tN, 0, y1, y2, 1);
      const xPos = bezierPoint(t, 0, x1, x2, 1);
      const v = Math.abs((valN - val) / step);
      velocities.push({ x: xPos, v, t });
    }

    const maxV = Math.max(...velocities.map((d) => d.v), 0.01);
    let peakT = 0;
    let peakV = 0;
    velocities.forEach((d) => {
      if (d.v > peakV) { peakV = d.v; peakT = d.t; }
    });

    const pts = velocities.map((d, i) => {
      const px = d.x * innerW + PADDING;
      const py = innerH - (d.v / maxV) * innerH + PADDING;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    });

    const lastX = velocities[velocities.length - 1].x * innerW + PADDING;
    const firstX = velocities[0].x * innerW + PADDING;
    const baseline = height - PADDING;

    return {
      path: pts.join(" "),
      fillPath: `${pts.join(" ")} L${lastX},${baseline} L${firstX},${baseline} Z`,
      maxVelocity: maxV,
      peakTime: peakT,
    };
  }, [bezier, innerW, innerH, height, x1, y1, x2, y2]);

  // Peak position for annotation
  const peakX = bezierPoint(peakTime, 0, x1, x2, 1) * innerW + PADDING;
  const peakY = PADDING + 2;

  return (
    <div className="ae-panel">
      <div className="ae-panel-header justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: `hsl(${color})` }} />
          <span className="ae-label">{label}</span>
        </div>
        <span className="ae-mono text-[9px] text-muted-foreground">
          peak: {maxVelocity.toFixed(1)}x @ {(peakTime * 100).toFixed(0)}%
        </span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PADDING} y1={PADDING + f * innerH}
              x2={width - PADDING} y2={PADDING + f * innerH}
              stroke="hsl(var(--ae-grid))"
              strokeWidth={f === 0 || f === 1 ? 0.8 : 0.4}
            />
            <line
              x1={PADDING + f * innerW} y1={PADDING}
              x2={PADDING + f * innerW} y2={height - PADDING}
              stroke="hsl(var(--ae-grid))"
              strokeWidth={f === 0 || f === 1 ? 0.8 : 0.4}
            />
          </g>
        ))}

        {/* Axis labels */}
        <text x={PADDING - 5} y={PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">MAX</text>
        <text x={PADDING - 5} y={PADDING + innerH * 0.5 + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">50%</text>
        <text x={PADDING - 5} y={height - PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">0</text>
        <text x={PADDING} y={height - PADDING + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">0s</text>
        <text x={width - PADDING} y={height - PADDING + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">1s</text>
        <text x={8} y={height / 2} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono" transform={`rotate(-90, 8, ${height / 2})`}>SPEED</text>
        <text x={width / 2} y={height - PADDING + 24} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">TIME</text>

        {/* Fill area */}
        <path d={fillPath} fill={`hsl(${color} / 0.1)`} />

        {/* Speed curve */}
        <path d={path} fill="none" stroke={`hsl(${color})`} strokeWidth={2} strokeLinecap="round" />

        {/* Peak marker */}
        <line x1={peakX} y1={peakY} x2={peakX} y2={height - PADDING} stroke={`hsl(${color} / 0.25)`} strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={peakX} cy={peakY + 4} r={3} fill={`hsl(${color})`} />
        <text x={peakX} y={peakY - 2} textAnchor="middle" fill={`hsl(${color})`} fontSize={7} fontFamily="JetBrains Mono">PEAK</text>
      </svg>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-card">
        <span className="ae-mono text-[9px] text-muted-foreground">
          Shows velocity (rate of change) over time
        </span>
        <span className="ae-mono text-[9px] text-muted-foreground/50">
          derivative of value graph
        </span>
      </div>
    </div>
  );
};

export default SpeedGraph;
