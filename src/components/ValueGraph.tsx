import { useMemo } from "react";
import { motion } from "framer-motion";

interface ValueGraphProps {
  easing: string;
  duration: number;
  property?: string;
  width?: number;
  height?: number;
}

const EASING_BEZIERS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
};

function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function generateVelocityCurve(
  bezier: [number, number, number, number],
  w: number,
  h: number,
  padding: number
): string {
  const [x1, y1, x2, y2] = bezier;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const points: string[] = [];
  const step = 1 / 100;

  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const tNext = Math.min(1, t + step);
    const val = bezierPoint(t, 0, y1, y2, 1);
    const valNext = bezierPoint(tNext, 0, y1, y2, 1);
    const velocity = Math.abs((valNext - val) / step);
    const normalizedVelocity = Math.min(velocity / 3, 1); // Normalize

    const x = (bezierPoint(t, 0, x1, x2, 1)) * innerW + padding;
    const y = innerH - normalizedVelocity * innerH + padding;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const ValueGraph = ({ easing, duration, property = "Position X", width = 280, height = 140 }: ValueGraphProps) => {
  const padding = 28;
  const bezier = EASING_BEZIERS[easing] || EASING_BEZIERS.linear;
  const velocityPath = useMemo(() => generateVelocityCurve(bezier, width, height, padding), [bezier, width, height]);

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  return (
    <div className="relative rounded-xl border border-border/60 bg-[hsl(260,20%,6%)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-[hsl(260,15%,10%)]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Value Graph — {property}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">velocity</span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={`vg-${frac}`}>
            <line
              x1={padding}
              y1={padding + frac * innerH}
              x2={width - padding}
              y2={padding + frac * innerH}
              stroke="hsl(260 15% 18%)"
              strokeWidth={0.5}
            />
            <line
              x1={padding + frac * innerW}
              y1={padding}
              x2={padding + frac * innerW}
              y2={height - padding}
              stroke="hsl(260 15% 18%)"
              strokeWidth={0.5}
            />
          </g>
        ))}

        {/* Velocity curve */}
        <motion.path
          d={velocityPath}
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Filled area under curve */}
        <motion.path
          d={`${velocityPath} L${width - padding},${height - padding} L${padding},${height - padding} Z`}
          fill="hsl(var(--success) / 0.08)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Axis labels */}
        <text x={padding} y={height - padding + 12} className="fill-muted-foreground" fontSize={7} fontFamily="monospace">0f</text>
        <text x={width - padding} y={height - padding + 12} textAnchor="end" className="fill-muted-foreground" fontSize={7} fontFamily="monospace">{Math.round(duration * 24)}f</text>
        <text x={width / 2} y={height - 4} textAnchor="middle" className="fill-muted-foreground" fontSize={7} fontFamily="monospace">FRAMES @ 24fps</text>
      </svg>
    </div>
  );
};

export default ValueGraph;
