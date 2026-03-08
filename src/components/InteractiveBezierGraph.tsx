import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface InteractiveBezierGraphProps {
  bezier: [number, number, number, number];
  onChange?: (bezier: [number, number, number, number]) => void;
  targetBezier?: [number, number, number, number];
  width?: number;
  height?: number;
  interactive?: boolean;
  showLabels?: boolean;
  showSpeed?: boolean;
  label?: string;
  color?: string;
}

const PADDING = 40;

function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function generateCurvePath(
  bezier: [number, number, number, number],
  w: number,
  h: number
): string {
  const [x1, y1, x2, y2] = bezier;
  const innerW = w - PADDING * 2;
  const innerH = h - PADDING * 2;
  const points: string[] = [];

  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const x = bezierPoint(t, 0, x1, x2, 1) * innerW + PADDING;
    const y = innerH - bezierPoint(t, 0, y1, y2, 1) * innerH + PADDING;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

function generateSpeedPath(
  bezier: [number, number, number, number],
  w: number,
  h: number,
  speedH: number
): string {
  const [x1, y1, x2, y2] = bezier;
  const innerW = w - PADDING * 2;
  const points: string[] = [];
  const step = 1 / 120;

  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const tNext = Math.min(1, t + step);
    const val = bezierPoint(t, 0, y1, y2, 1);
    const valNext = bezierPoint(tNext, 0, y1, y2, 1);
    const velocity = Math.abs((valNext - val) / step);
    const normalizedVelocity = Math.min(velocity / 3, 1);

    const x = bezierPoint(t, 0, x1, x2, 1) * innerW + PADDING;
    const y = speedH - normalizedVelocity * (speedH - 8) + 4;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const InteractiveBezierGraph = ({
  bezier,
  onChange,
  targetBezier,
  width = 320,
  height = 280,
  interactive = true,
  showLabels = true,
  showSpeed = true,
  label = "Value Graph",
  color = "var(--ae-yellow)",
}: InteractiveBezierGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<null | 1 | 2>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const animRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);

  const innerW = width - PADDING * 2;
  const innerH = height - PADDING * 2;
  const speedH = showSpeed ? 60 : 0;
  const totalH = height + speedH;

  const curvePath = useMemo(() => generateCurvePath(bezier, width, height), [bezier, width, height]);
  const targetPath = useMemo(
    () => targetBezier ? generateCurvePath(targetBezier, width, height) : null,
    [targetBezier, width, height]
  );
  const speedPath = useMemo(
    () => showSpeed ? generateSpeedPath(bezier, width, height, speedH) : null,
    [bezier, width, height, speedH, showSpeed]
  );

  // Control points in SVG coordinates
  const cp1 = { x: bezier[0] * innerW + PADDING, y: innerH - bezier[1] * innerH + PADDING };
  const cp2 = { x: bezier[2] * innerW + PADDING, y: innerH - bezier[3] * innerH + PADDING };
  const startPt = { x: PADDING, y: height - PADDING };
  const endPt = { x: width - PADDING, y: PADDING };

  // Playback dot position
  const dotPos = useMemo(() => {
    const t = animProgress;
    const x = bezierPoint(t, 0, bezier[0], bezier[2], 1) * innerW + PADDING;
    const y = innerH - bezierPoint(t, 0, bezier[1], bezier[3], 1) * innerH + PADDING;
    return { x, y };
  }, [animProgress, bezier, innerW, innerH]);

  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * totalH,
    };
  }, [width, totalH]);

  const handlePointerDown = useCallback((handle: 1 | 2) => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, [interactive]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !onChange) return;
    const pt = getSVGPoint(e.clientX, e.clientY);

    const newBezier: [number, number, number, number] = [...bezier];
    if (dragging === 1) {
      newBezier[0] = Math.max(0, Math.min(1, (pt.x - PADDING) / innerW));
      newBezier[1] = Math.max(-0.5, Math.min(2, (innerH - (pt.y - PADDING)) / innerH));
    } else {
      newBezier[2] = Math.max(0, Math.min(1, (pt.x - PADDING) / innerW));
      newBezier[3] = Math.max(-0.5, Math.min(2, (innerH - (pt.y - PADDING)) / innerH));
    }
    onChange(newBezier);
  }, [dragging, onChange, bezier, getSVGPoint, innerW, innerH]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  // Playback animation
  const playAnimation = useCallback(() => {
    if (isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setIsPlaying(false);
      setAnimProgress(0);
      return;
    }
    setIsPlaying(true);
    const startTime = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      setAnimProgress(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        setTimeout(() => setAnimProgress(0), 600);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [isPlaying]);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const bezierString = `cubic-bezier(${bezier.map(v => v.toFixed(2)).join(", ")})`;

  return (
    <div className="ae-panel">
      {/* Header */}
      <div className="ae-panel-header justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: `hsl(${color})` }} />
          <span className="ae-label">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={playAnimation}
            className="px-2 py-0.5 rounded text-[10px] ae-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {isPlaying ? "■ STOP" : "▶ PLAY"}
          </button>
          <span className="ae-mono text-[10px] text-muted-foreground">{bezierString}</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={totalH}
        viewBox={`0 0 ${width} ${totalH}`}
        className="w-full touch-graph"
        style={{ aspectRatio: `${width}/${totalH}` }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={`grid-${frac}`}>
            <line
              x1={PADDING}
              y1={PADDING + frac * innerH}
              x2={width - PADDING}
              y2={PADDING + frac * innerH}
              stroke="hsl(var(--ae-grid))"
              strokeWidth={frac === 0 || frac === 1 ? 1 : 0.5}
            />
            <line
              x1={PADDING + frac * innerW}
              y1={PADDING}
              x2={PADDING + frac * innerW}
              y2={height - PADDING}
              stroke="hsl(var(--ae-grid))"
              strokeWidth={frac === 0 || frac === 1 ? 1 : 0.5}
            />
          </g>
        ))}

        {/* Axis labels */}
        {showLabels && (
          <>
            <text x={PADDING - 6} y={PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={8} fontFamily="JetBrains Mono">100%</text>
            <text x={PADDING - 6} y={PADDING + innerH * 0.5 + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={8} fontFamily="JetBrains Mono">50%</text>
            <text x={PADDING - 6} y={height - PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={8} fontFamily="JetBrains Mono">0%</text>
            <text x={PADDING} y={height - PADDING + 16} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={8} fontFamily="JetBrains Mono">0s</text>
            <text x={width - PADDING} y={height - PADDING + 16} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={8} fontFamily="JetBrains Mono">1s</text>
            <text x={10} y={height / 2} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono" transform={`rotate(-90, 10, ${height / 2})`}>VALUE</text>
            <text x={width / 2} y={height - PADDING + 28} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">TIME</text>
          </>
        )}

        {/* Linear reference */}
        <line
          x1={startPt.x} y1={startPt.y}
          x2={endPt.x} y2={endPt.y}
          stroke="hsl(var(--muted-foreground) / 0.15)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Target curve (if in practice mode) */}
        {targetPath && (
          <path
            d={targetPath}
            fill="none"
            stroke="hsl(var(--ae-green) / 0.4)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
          />
        )}

        {/* Control handle lines */}
        <line x1={startPt.x} y1={startPt.y} x2={cp1.x} y2={cp1.y} stroke={`hsl(${color} / 0.5)`} strokeWidth={1} />
        <line x1={endPt.x} y1={endPt.y} x2={cp2.x} y2={cp2.y} stroke={`hsl(${color} / 0.5)`} strokeWidth={1} />

        {/* The curve */}
        <motion.path
          d={curvePath}
          fill="none"
          stroke={`hsl(${color})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Animated dot */}
        {animProgress > 0 && (
          <>
            <circle cx={dotPos.x} cy={dotPos.y} r={6} fill={`hsl(${color})`} opacity={0.9} />
            <circle cx={dotPos.x} cy={dotPos.y} r={10} fill={`hsl(${color} / 0.2)`} />
            {/* Crosshair */}
            <line x1={PADDING} y1={dotPos.y} x2={dotPos.x} y2={dotPos.y} stroke={`hsl(${color} / 0.2)`} strokeWidth={0.5} strokeDasharray="2 2" />
            <line x1={dotPos.x} y1={height - PADDING} x2={dotPos.x} y2={dotPos.y} stroke={`hsl(${color} / 0.2)`} strokeWidth={0.5} strokeDasharray="2 2" />
          </>
        )}

        {/* Draggable control points */}
        {interactive ? (
          <>
            <circle
              cx={cp1.x} cy={cp1.y} r={dragging === 1 ? 9 : 7}
              fill={`hsl(${color})`}
              stroke="hsl(var(--background))"
              strokeWidth={2}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown(1)}
              style={{ filter: dragging === 1 ? `drop-shadow(0 0 6px hsl(${color}))` : "none" }}
            />
            <circle
              cx={cp2.x} cy={cp2.y} r={dragging === 2 ? 9 : 7}
              fill={`hsl(${color})`}
              stroke="hsl(var(--background))"
              strokeWidth={2}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown(2)}
              style={{ filter: dragging === 2 ? `drop-shadow(0 0 6px hsl(${color}))` : "none" }}
            />
          </>
        ) : (
          <>
            <circle cx={cp1.x} cy={cp1.y} r={4} fill={`hsl(${color})`} stroke="hsl(var(--background))" strokeWidth={1.5} />
            <circle cx={cp2.x} cy={cp2.y} r={4} fill={`hsl(${color})`} stroke="hsl(var(--background))" strokeWidth={1.5} />
          </>
        )}

        {/* Start/end keyframe diamonds */}
        <g transform={`translate(${startPt.x}, ${startPt.y})`}>
          <rect x={-4} y={-4} width={8} height={8} rx={1} fill={`hsl(${color})`} transform="rotate(45)" />
        </g>
        <g transform={`translate(${endPt.x}, ${endPt.y})`}>
          <rect x={-4} y={-4} width={8} height={8} rx={1} fill={`hsl(${color})`} transform="rotate(45)" />
        </g>

        {/* Speed graph area */}
        {showSpeed && speedPath && (
          <>
            <line x1={PADDING} y1={height + 4} x2={width - PADDING} y2={height + 4} stroke="hsl(var(--border))" strokeWidth={0.5} />
            <text x={PADDING - 6} y={height + speedH / 2 + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">SPD</text>
            <path
              d={speedPath}
              fill="none"
              stroke="hsl(var(--ae-green))"
              strokeWidth={1.5}
              strokeLinecap="round"
              transform={`translate(0, ${height})`}
            />
            <path
              d={`${speedPath} L${width - PADDING},${speedH} L${PADDING},${speedH} Z`}
              fill="hsl(var(--ae-green) / 0.08)"
              transform={`translate(0, ${height})`}
            />
          </>
        )}
      </svg>

      {/* Footer with values */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-card">
        <div className="flex gap-3">
          <span className="ae-mono text-[9px] text-muted-foreground">
            CP1: ({bezier[0].toFixed(2)}, {bezier[1].toFixed(2)})
          </span>
          <span className="ae-mono text-[9px] text-muted-foreground">
            CP2: ({bezier[2].toFixed(2)}, {bezier[3].toFixed(2)})
          </span>
        </div>
        {interactive && (
          <span className="ae-mono text-[9px] text-muted-foreground/50">drag handles to edit</span>
        )}
      </div>
    </div>
  );
};

export default InteractiveBezierGraph;
