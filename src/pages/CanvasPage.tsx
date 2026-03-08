import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, Play, Square, RotateCcw } from "lucide-react";
import { COMMON_PRESETS } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AnimObject {
  id: string;
  label: string;
  bezier: [number, number, number, number];
  duration: number;
  color: string;
  shape: "square" | "circle" | "pill";
}

const COLORS = [
  "var(--ae-yellow)",
  "var(--ae-green)",
  "var(--ae-blue)",
  "var(--ae-orange)",
  "var(--ae-purple)",
  "var(--ae-red)",
];

const SHAPES: AnimObject["shape"][] = ["square", "circle", "pill"];

let idCounter = 0;
const makeId = () => `obj-${++idCounter}`;

const DEFAULT_OBJECTS: AnimObject[] = [
  { id: makeId(), label: "Ease Out", bezier: [0, 0, 0.58, 1], duration: 0.6, color: COLORS[0], shape: "square" },
  { id: makeId(), label: "Linear", bezier: [0, 0, 1, 1], duration: 0.6, color: COLORS[1], shape: "circle" },
  { id: makeId(), label: "Ease In-Out", bezier: [0.42, 0, 0.58, 1], duration: 0.6, color: COLORS[2], shape: "pill" },
];

const CanvasPage = () => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState<AnimObject[]>(DEFAULT_OBJECTS);
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_OBJECTS[0].id);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>();
  const startRef = useRef(0);

  const selected = objects.find((o) => o.id === selectedId) || null;
  const maxDuration = Math.max(...objects.map((o) => o.duration), 0.5);

  const addObject = () => {
    const idx = objects.length % COLORS.length;
    const shapeIdx = objects.length % SHAPES.length;
    const newObj: AnimObject = {
      id: makeId(),
      label: `Object ${objects.length + 1}`,
      bezier: [0.25, 0.1, 0.25, 1],
      duration: 0.6,
      color: COLORS[idx],
      shape: SHAPES[shapeIdx],
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const removeObject = (id: string) => {
    const next = objects.filter((o) => o.id !== id);
    setObjects(next);
    if (selectedId === id) setSelectedId(next[0]?.id || null);
  };

  const updateObject = (id: string, patch: Partial<AnimObject>) => {
    setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  // Playback
  const play = useCallback(() => {
    if (playing) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setPlaying(false);
      setProgress(0);
      return;
    }
    setPlaying(true);
    startRef.current = performance.now();
    const dur = maxDuration * 1000;

    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / dur, 1);
      setProgress(p);
      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
        setTimeout(() => setProgress(0), 400);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [playing, maxDuration]);

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Bezier evaluation for position
  const evalBezier = (t: number, b: [number, number, number, number]) => {
    const [x1, y1, x2, y2] = b;
    const u = 1 - t;
    // We need to solve for the y-value at parameter t along the curve
    // Simplified: approximate by evaluating the cubic
    const xT = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
    const yT = 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
    return yT;
  };

  // Get animated X position for each object
  const getObjX = (obj: AnimObject) => {
    const objProgress = Math.min(progress / (obj.duration / maxDuration), 1);
    const easedProgress = evalBezier(objProgress, obj.bezier);
    return easedProgress;
  };

  const renderShape = (obj: AnimObject, size: number) => {
    if (obj.shape === "circle") return { borderRadius: "50%", width: size, height: size };
    if (obj.shape === "pill") return { borderRadius: size / 2, width: size * 1.8, height: size };
    return { borderRadius: 4, width: size, height: size };
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4 flex items-center gap-3"
      >
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">Motion Canvas</h1>
          <p className="text-[11px] text-muted-foreground">Compare curves side-by-side in real-time</p>
        </div>
      </motion.div>

      {/* Canvas / Stage */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="ae-panel mb-4"
      >
        <div className="ae-panel-header justify-between">
          <span className="ae-label">Stage</span>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={play} className="px-2 py-0.5 rounded text-[10px] ae-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              {playing ? (
                <span className="flex items-center gap-1"><Square className="h-3 w-3" /> STOP</span>
              ) : (
                <span className="flex items-center gap-1"><Play className="h-3 w-3" /> PLAY</span>
              )}
            </button>
          </div>
        </div>

        <div className="relative bg-card overflow-hidden" style={{ height: objects.length * 48 + 32 }}>
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0.25, 0.5, 0.75].map((f) => (
              <div key={f} className="absolute top-0 bottom-0 border-l border-border/30" style={{ left: `${f * 100}%` }} />
            ))}
          </div>

          {/* Start line */}
          <div className="absolute top-0 bottom-0 left-6 border-l border-dashed border-muted-foreground/20" />
          {/* End line */}
          <div className="absolute top-0 bottom-0 right-6 border-l border-dashed border-muted-foreground/20" />

          {/* Labels */}
          <div className="absolute top-1 left-7 ae-mono text-[8px] text-muted-foreground/40">START</div>
          <div className="absolute top-1 right-7 ae-mono text-[8px] text-muted-foreground/40">END</div>

          {/* Objects */}
          {objects.map((obj, i) => {
            const xFraction = getObjX(obj);
            const trackWidth = 280; // approximate usable width
            const leftBase = 24;
            const xPos = leftBase + xFraction * (trackWidth - 40);
            const yPos = 20 + i * 48;
            const isSelected = selectedId === obj.id;
            const shapeStyle = renderShape(obj, 28);

            return (
              <div key={obj.id}>
                {/* Track line */}
                <div
                  className="absolute h-px"
                  style={{
                    top: yPos + 14,
                    left: leftBase,
                    right: 24,
                    background: `hsl(${obj.color} / 0.15)`,
                  }}
                />

                {/* Track label */}
                <div
                  className="absolute ae-mono text-[8px]"
                  style={{
                    top: yPos - 1,
                    left: leftBase,
                    color: `hsl(${obj.color} / 0.5)`,
                  }}
                >
                  {obj.label}
                </div>

                {/* Animated shape */}
                <motion.div
                  className="absolute cursor-pointer"
                  style={{
                    top: yPos,
                    left: xPos,
                    ...shapeStyle,
                    background: `linear-gradient(135deg, hsl(${obj.color}), hsl(${obj.color} / 0.7))`,
                    boxShadow: isSelected
                      ? `0 0 12px hsl(${obj.color} / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.2)`
                      : `0 2px 8px hsl(${obj.color} / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.1)`,
                    border: isSelected ? `1.5px solid hsl(${obj.color})` : "1px solid transparent",
                    transition: "box-shadow 0.2s, border 0.2s",
                  }}
                  onClick={() => setSelectedId(obj.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Timeline bar */}
        <div className="px-3 py-2 border-t border-border flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-75"
              style={{ width: `${progress * 100}%`, background: "hsl(var(--primary))" }}
            />
          </div>
          <span className="ae-mono text-[9px] text-muted-foreground w-10 text-right">
            {(progress * maxDuration).toFixed(2)}s
          </span>
        </div>
      </motion.div>

      {/* Object List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="ae-panel mb-4"
      >
        <div className="ae-panel-header justify-between">
          <span className="ae-label">Objects ({objects.length})</span>
          <button
            onClick={addObject}
            disabled={objects.length >= 6}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ae-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
          >
            <Plus className="h-3 w-3" /> ADD
          </button>
        </div>

        <div className="divide-y divide-border">
          {objects.map((obj) => {
            const isSelected = selectedId === obj.id;
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedId(obj.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  isSelected ? "bg-accent/40" : "hover:bg-accent/20"
                }`}
              >
                <div
                  className="h-4 w-4 rounded-sm flex-shrink-0"
                  style={{ background: `hsl(${obj.color})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium truncate">{obj.label}</p>
                  <p className="ae-mono text-[9px] text-muted-foreground">
                    ({obj.bezier.map((v) => v.toFixed(2)).join(", ")}) · {obj.duration}s
                  </p>
                </div>
                {objects.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                    className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Object Editor */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ae-panel mb-4"
        >
          <div className="ae-panel-header justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-sm" style={{ background: `hsl(${selected.color})` }} />
              <span className="ae-label">Edit: {selected.label}</span>
            </div>
          </div>

          <div className="p-3 space-y-4">
            {/* Label */}
            <div>
              <span className="ae-label block mb-1">Label</span>
              <input
                value={selected.label}
                onChange={(e) => updateObject(selected.id, { label: e.target.value })}
                className="w-full bg-muted border border-border rounded px-2 py-1.5 text-[11px] ae-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="ae-label">Duration</span>
                <span className="ae-mono text-[11px]" style={{ color: `hsl(${selected.color})` }}>
                  {selected.duration.toFixed(2)}s
                </span>
              </div>
              <Slider
                value={[selected.duration]}
                onValueChange={([v]) => updateObject(selected.id, { duration: v })}
                min={0.1}
                max={2}
                step={0.05}
              />
            </div>

            {/* Shape */}
            <div>
              <span className="ae-label block mb-1.5">Shape</span>
              <div className="flex gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateObject(selected.id, { shape: s })}
                    className={`flex items-center justify-center h-9 rounded border transition-all ae-mono text-[9px] ${
                      selected.shape === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                    style={{ width: s === "pill" ? 56 : 36 }}
                  >
                    {s === "square" && <div className="w-4 h-4 rounded-sm" style={{ background: `hsl(${selected.color})` }} />}
                    {s === "circle" && <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${selected.color})` }} />}
                    {s === "pill" && <div className="w-7 h-3.5 rounded-full" style={{ background: `hsl(${selected.color})` }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <span className="ae-label block mb-1.5">Color</span>
              <div className="flex gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateObject(selected.id, { color: c })}
                    className={`h-6 w-6 rounded-full transition-all ${
                      selected.color === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"
                    }`}
                    style={{ background: `hsl(${c})` }}
                  />
                ))}
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="ae-label block mb-1.5">Easing Preset</span>
              <div className="flex flex-wrap gap-1">
                {COMMON_PRESETS.map((p) => {
                  const isActive = p.bezier.every((v, i) => Math.abs(v - selected.bezier[i]) < 0.01);
                  return (
                    <button
                      key={p.label}
                      onClick={() => updateObject(selected.id, { bezier: [...p.bezier], label: p.label })}
                      className={`rounded px-2 py-1 ae-mono text-[9px] border transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual bezier */}
            <div>
              <span className="ae-label block mb-1.5">Custom Bezier</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(["x1", "y1", "x2", "y2"] as const).map((key, i) => (
                  <div key={key}>
                    <label className="ae-mono text-[8px] text-muted-foreground block mb-0.5">{key}</label>
                    <input
                      type="number"
                      value={selected.bezier[i]}
                      onChange={(e) => {
                        const newBez: [number, number, number, number] = [...selected.bezier];
                        newBez[i] = parseFloat(e.target.value) || 0;
                        updateObject(selected.id, { bezier: newBez });
                      }}
                      step={0.05}
                      min={i % 2 === 0 ? 0 : -0.5}
                      max={i % 2 === 0 ? 1 : 2}
                      className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] ae-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mini curve comparison */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="ae-panel mb-4"
      >
        <div className="ae-panel-header">
          <span className="ae-label">Curve Overlay</span>
        </div>
        <CurveOverlay objects={objects} selectedId={selectedId} />
      </motion.div>

      {/* Quick play */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button onClick={play} className="w-full rounded-lg py-5 text-sm font-medium">
          {playing ? "■ Stop Animation" : "▶ Play All Curves"}
        </Button>
      </motion.div>
    </div>
  );
};

// Overlay showing all curves on one graph
function CurveOverlay({ objects, selectedId }: { objects: AnimObject[]; selectedId: string | null }) {
  const w = 320;
  const h = 180;
  const pad = 32;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const bezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ aspectRatio: `${w}/${h}` }}>
      {/* Grid */}
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad} y1={pad + f * innerH} x2={w - pad} y2={pad + f * innerH} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
          <line x1={pad + f * innerW} y1={pad} x2={pad + f * innerW} y2={h - pad} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
        </g>
      ))}

      {/* Linear reference */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={pad} stroke="hsl(var(--muted-foreground) / 0.1)" strokeWidth={1} strokeDasharray="4 4" />

      {/* Labels */}
      <text x={pad - 4} y={pad + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">1</text>
      <text x={pad - 4} y={h - pad + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">0</text>
      <text x={pad} y={h - pad + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">0s</text>
      <text x={w - pad} y={h - pad + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} fontFamily="JetBrains Mono">1s</text>

      {/* All curves */}
      {objects.map((obj) => {
        const [x1, y1, x2, y2] = obj.bezier;
        const pts: string[] = [];
        for (let i = 0; i <= 100; i++) {
          const t = i / 100;
          const x = bezierPoint(t, 0, x1, x2, 1) * innerW + pad;
          const y = innerH - bezierPoint(t, 0, y1, y2, 1) * innerH + pad;
          pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const isSelected = obj.id === selectedId;
        return (
          <path
            key={obj.id}
            d={pts.join(" ")}
            fill="none"
            stroke={`hsl(${obj.color})`}
            strokeWidth={isSelected ? 2.5 : 1.5}
            strokeLinecap="round"
            opacity={isSelected ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
}

export default CanvasPage;
