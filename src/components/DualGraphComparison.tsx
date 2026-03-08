import { useState, useRef, useEffect, useMemo, useCallback } from "react";

interface DualGraphComparisonProps {
  bezier: [number, number, number, number];
  width?: number;
}

const PADDING = 32;

function bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

const DualGraphComparison = ({ bezier, width = 320 }: DualGraphComparisonProps) => {
  const graphH = 140;
  const innerW = width - PADDING * 2;
  const innerH = graphH - PADDING * 2;
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<number>();

  const play = useCallback(() => {
    if (playing) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setPlaying(false);
      setProgress(0);
      return;
    }
    setPlaying(true);
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(p);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
      else {
        setPlaying(false);
        setTimeout(() => setProgress(0), 500);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [playing]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  // Generate paths
  const valuePath = useMemo(() => {
    const [x1, y1, x2, y2] = bezier;
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = bezierPoint(t, 0, x1, x2, 1) * innerW + PADDING;
      const y = innerH - bezierPoint(t, 0, y1, y2, 1) * innerH + PADDING;
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [bezier, innerW, innerH]);

  const speedPath = useMemo(() => {
    const [x1, y1, x2, y2] = bezier;
    const step = 1 / 100;
    const velocities: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const tN = Math.min(1, t + step);
      const v = Math.abs((bezierPoint(tN, 0, y1, y2, 1) - bezierPoint(t, 0, y1, y2, 1)) / step);
      velocities.push(v);
    }
    const maxV = Math.max(...velocities, 0.01);
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = bezierPoint(t, 0, x1, x2, 1) * innerW + PADDING;
      const y = innerH - (velocities[i] / maxV) * innerH + PADDING;
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [bezier, innerW, innerH]);

  // Playhead positions
  const valuePos = useMemo(() => {
    const [x1, y1, x2, y2] = bezier;
    const x = bezierPoint(progress, 0, x1, x2, 1) * innerW + PADDING;
    const y = innerH - bezierPoint(progress, 0, y1, y2, 1) * innerH + PADDING;
    return { x, y };
  }, [progress, bezier, innerW, innerH]);

  const speedPos = useMemo(() => {
    const [x1, y1, x2, y2] = bezier;
    const step = 1 / 100;
    const velocities: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const tN = Math.min(1, t + step);
      velocities.push(Math.abs((bezierPoint(tN, 0, y1, y2, 1) - bezierPoint(t, 0, y1, y2, 1)) / step));
    }
    const maxV = Math.max(...velocities, 0.01);
    const idx = Math.round(progress * 100);
    const x = bezierPoint(progress, 0, x1, x2, 1) * innerW + PADDING;
    const y = innerH - (velocities[Math.min(idx, 100)] / maxV) * innerH + PADDING;
    return { x, y };
  }, [progress, bezier, innerW, innerH]);

  const renderGraph = (path: string, dotPos: { x: number; y: number }, color: string, labelText: string, sublabel: string) => (
    <svg width={width} height={graphH} viewBox={`0 0 ${width} ${graphH}`} className="w-full">
      {/* Grid */}
      {[0, 0.5, 1].map(f => (
        <g key={f}>
          <line x1={PADDING} y1={PADDING + f * innerH} x2={width - PADDING} y2={PADDING + f * innerH} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
          <line x1={PADDING + f * innerW} y1={PADDING} x2={PADDING + f * innerW} y2={graphH - PADDING} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
        </g>
      ))}
      {/* Labels */}
      <text x={PADDING - 4} y={PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">max</text>
      <text x={PADDING - 4} y={graphH - PADDING + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">0</text>
      <text x={PADDING} y={12} fill={color} fontSize={8} fontFamily="JetBrains Mono" fontWeight="600">{labelText}</text>
      <text x={PADDING} y={22} fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">{sublabel}</text>
      {/* Curve */}
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      {/* Fill */}
      <path d={`${path} L${width - PADDING},${graphH - PADDING} L${PADDING},${graphH - PADDING} Z`} fill={`${color.replace(")", " / 0.06)")}`} />
      {/* Playhead */}
      {progress > 0 && (
        <>
          <line x1={dotPos.x} y1={PADDING} x2={dotPos.x} y2={graphH - PADDING} stroke={`${color.replace(")", " / 0.3)")}`} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={dotPos.x} cy={dotPos.y} r={5} fill={color} />
          <circle cx={dotPos.x} cy={dotPos.y} r={9} fill={`${color.replace(")", " / 0.15)")}`} />
        </>
      )}
    </svg>
  );

  return (
    <div className="ae-panel">
      <div className="ae-panel-header justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="ae-label">Side-by-Side Comparison</span>
        </div>
        <button
          onClick={play}
          className="px-2 py-0.5 rounded text-[10px] ae-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {playing ? "■ STOP" : "▶ SYNC PLAY"}
        </button>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        <div>
          {renderGraph(valuePath, valuePos, "hsl(var(--ae-yellow))", "VALUE", "Position over time")}
        </div>
        <div>
          {renderGraph(speedPath, speedPos, "hsl(var(--ae-green))", "SPEED", "Velocity over time")}
        </div>
      </div>

      {/* Sync bar */}
      <div className="px-3 py-2 border-t border-border flex items-center gap-3">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress * 100}%`,
              background: "hsl(var(--primary))",
            }}
          />
        </div>
        <span className="ae-mono text-[9px] text-muted-foreground">{(progress * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default DualGraphComparison;
