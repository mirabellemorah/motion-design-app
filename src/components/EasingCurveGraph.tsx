import { useMemo } from "react";
import { motion } from "framer-motion";

interface EasingCurveGraphProps {
  easing: string;
  duration: number;
  progress?: number;
  width?: number;
  height?: number;
}

// Cubic bezier control points for each easing
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

function generateCurvePath(
  bezier: [number, number, number, number],
  w: number,
  h: number,
  padding: number
): string {
  const [x1, y1, x2, y2] = bezier;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const points: string[] = [];

  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const x = bezierPoint(t, 0, x1, x2, 1) * innerW + padding;
    const y = innerH - bezierPoint(t, 0, y1, y2, 1) * innerH + padding;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const EasingCurveGraph = ({ easing, duration, width = 280, height = 200 }: EasingCurveGraphProps) => {
  const padding = 32;
  const bezier = EASING_BEZIERS[easing] || EASING_BEZIERS.linear;
  const curvePath = useMemo(() => generateCurvePath(bezier, width, height, padding), [bezier, width, height]);

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // Control point positions for visual handles
  const cp1 = { x: bezier[0] * innerW + padding, y: innerH - bezier[1] * innerH + padding };
  const cp2 = { x: bezier[2] * innerW + padding, y: innerH - bezier[3] * innerH + padding };
  const startPt = { x: padding, y: height - padding };
  const endPt = { x: width - padding, y: padding };

  return (
    <div className="relative rounded-xl border border-border/60 bg-[hsl(260,20%,6%)] overflow-hidden">
      {/* AE-style header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-[hsl(260,15%,10%)]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--xp-gold))]" />
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Speed Graph</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{duration.toFixed(2)}s</span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={`grid-${frac}`}>
            <line
              x1={padding}
              y1={padding + frac * innerH}
              x2={width - padding}
              y2={padding + frac * innerH}
              stroke="hsl(260 15% 20%)"
              strokeWidth={0.5}
            />
            <line
              x1={padding + frac * innerW}
              y1={padding}
              x2={padding + frac * innerW}
              y2={height - padding}
              stroke="hsl(260 15% 20%)"
              strokeWidth={0.5}
            />
          </g>
        ))}

        {/* Axis labels */}
        <text x={padding - 4} y={padding + 3} textAnchor="end" className="fill-muted-foreground" fontSize={8} fontFamily="monospace">100%</text>
        <text x={padding - 4} y={height - padding + 3} textAnchor="end" className="fill-muted-foreground" fontSize={8} fontFamily="monospace">0%</text>
        <text x={padding} y={height - padding + 14} textAnchor="middle" className="fill-muted-foreground" fontSize={8} fontFamily="monospace">0s</text>
        <text x={width - padding} y={height - padding + 14} textAnchor="middle" className="fill-muted-foreground" fontSize={8} fontFamily="monospace">{duration.toFixed(1)}s</text>
        
        {/* Y-axis label */}
        <text x={8} y={height / 2} textAnchor="middle" className="fill-muted-foreground" fontSize={7} fontFamily="monospace" transform={`rotate(-90, 8, ${height / 2})`}>VALUE</text>
        {/* X-axis label */}
        <text x={width / 2} y={height - 6} textAnchor="middle" className="fill-muted-foreground" fontSize={7} fontFamily="monospace">TIME</text>

        {/* Diagonal reference (linear) */}
        <line
          x1={startPt.x}
          y1={startPt.y}
          x2={endPt.x}
          y2={endPt.y}
          stroke="hsl(260 15% 25%)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Bezier control handle lines */}
        <line x1={startPt.x} y1={startPt.y} x2={cp1.x} y2={cp1.y} stroke="hsl(var(--xp-gold) / 0.6)" strokeWidth={1} />
        <line x1={endPt.x} y1={endPt.y} x2={cp2.x} y2={cp2.y} stroke="hsl(var(--xp-gold) / 0.6)" strokeWidth={1} />

        {/* The easing curve */}
        <motion.path
          d={curvePath}
          fill="none"
          stroke="hsl(var(--xp-gold))"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Control point handles */}
        <circle cx={cp1.x} cy={cp1.y} r={4} fill="hsl(var(--xp-gold))" stroke="hsl(260,20%,6%)" strokeWidth={1.5} />
        <circle cx={cp2.x} cy={cp2.y} r={4} fill="hsl(var(--xp-gold))" stroke="hsl(260,20%,6%)" strokeWidth={1.5} />

        {/* Start/end keyframe diamonds */}
        <g transform={`translate(${startPt.x}, ${startPt.y})`}>
          <rect x={-4} y={-4} width={8} height={8} rx={1} fill="hsl(var(--xp-gold))" transform="rotate(45)" />
        </g>
        <g transform={`translate(${endPt.x}, ${endPt.y})`}>
          <rect x={-4} y={-4} width={8} height={8} rx={1} fill="hsl(var(--xp-gold))" transform="rotate(45)" />
        </g>
      </svg>
    </div>
  );
};

export default EasingCurveGraph;
