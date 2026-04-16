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

  const evalBezier = (t: number, b: [number, number, number, number]) => {
    const [x1, y1, x2, y2] = b;
    const u = 1 - t;
    const yT = 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
    return yT;
  };

  const getObjX = (obj: AnimObject) => {
    const objProgress = Math.min(progress / (obj.duration / maxDuration), 1);
    return evalBezier(objProgress, obj.bezier);
  };

  const renderShape = (obj: AnimObject, size: number) => {
    if (obj.shape === "circle") return { borderRadius: "50%", width: size, height: size };
    if (obj.shape === "pill") return { borderRadius: size / 2, width: size * 1.8, height: size };
    return { borderRadius: 6, width: size, height: size };
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground">Motion Canvas</h1>
          <p className="text-xs text-muted-foreground">Compare curves side-by-side in real-time</p>
        </div>
      </motion.div>

      {/* Stage — dark AE panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="ae-panel mb-4">
        <div className="ae-panel-header justify-between">
          <span className="ae-label" style={{ color: "hsl(var(--ae-panel-fg) / 0.5)" }}>Stage</span>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="p-1 transition-colors" style={{ color: "hsl(var(--ae-panel-fg) / 0.5)" }}>
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={play} className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors" style={{ color: "hsl(var(--ae-panel-fg) / 0.7)" }}>
              {playing ? (
                <span className="flex items-center gap-1"><Square className="h-3 w-3" /> STOP</span>
              ) : (
                <span className="flex items-center gap-1"><Play className="h-3 w-3" /> PLAY</span>
              )}
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden" style={{ height: objects.length * 48 + 32, background: "hsl(var(--ae-panel-bg))" }}>
          {[0.25, 0.5, 0.75].map((f) => (
            <div key={f} className="absolute top-0 bottom-0" style={{ left: `${f * 100}%`, borderLeft: "1px solid hsl(var(--ae-border) / 0.3)" }} />
          ))}
          <div className="absolute top-0 bottom-0 left-6" style={{ borderLeft: "1px dashed hsl(var(--ae-panel-fg) / 0.15)" }} />
          <div className="absolute top-0 bottom-0 right-6" style={{ borderLeft: "1px dashed hsl(var(--ae-panel-fg) / 0.15)" }} />
          <div className="absolute top-1 left-7 text-[8px] font-medium" style={{ color: "hsl(var(--ae-panel-fg) / 0.3)" }}>START</div>
          <div className="absolute top-1 right-7 text-[8px] font-medium" style={{ color: "hsl(var(--ae-panel-fg) / 0.3)" }}>END</div>

          {objects.map((obj, i) => {
            const xFraction = getObjX(obj);
            const trackWidth = 280;
            const leftBase = 24;
            const xPos = leftBase + xFraction * (trackWidth - 40);
            const yPos = 20 + i * 48;
            const isSelected = selectedId === obj.id;
            const shapeStyle = renderShape(obj, 28);

            return (
              <div key={obj.id}>
                <div className="absolute h-px" style={{ top: yPos + 14, left: leftBase, right: 24, background: `hsl(${obj.color} / 0.15)` }} />
                <div className="absolute text-[8px] font-medium" style={{ top: yPos - 1, left: leftBase, color: `hsl(${obj.color} / 0.5)` }}>
                  {obj.label}
                </div>
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

        <div className="px-3 py-2 flex items-center gap-3" style={{ borderTop: "1px solid hsl(var(--ae-border))" }}>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--ae-border))" }}>
            <div className="h-full rounded-full transition-[width] duration-75" style={{ width: `${progress * 100}%`, background: "hsl(var(--ae-blue))" }} />
          </div>
          <span className="text-[9px] font-medium w-10 text-right" style={{ color: "hsl(var(--ae-panel-fg) / 0.5)" }}>
            {(progress * maxDuration).toFixed(2)}s
          </span>
        </div>
      </motion.div>

      {/* Object List — light card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="soft-card mb-4 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <span className="ae-label">Objects ({objects.length})</span>
          <button
            onClick={addObject}
            disabled={objects.length >= 6}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-30"
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isSelected ? "bg-accent/40" : "hover:bg-accent/20"
                }`}
              >
                <div className="h-4 w-4 rounded-md flex-shrink-0" style={{ background: `hsl(${obj.color})` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{obj.label}</p>
                  <p className="text-[10px] text-muted-foreground">
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

      {/* Editor — light card */}
      {selected && (
        <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="soft-card mb-4 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ background: `hsl(${selected.color})` }} />
            <span className="ae-label">Edit: {selected.label}</span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <span className="ae-label block mb-1.5">Label</span>
              <input
                value={selected.label}
                onChange={(e) => updateObject(selected.id, { label: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="ae-label">Duration</span>
                <span className="text-xs font-medium text-primary">{selected.duration.toFixed(2)}s</span>
              </div>
              <Slider value={[selected.duration]} onValueChange={([v]) => updateObject(selected.id, { duration: v })} min={0.1} max={2} step={0.05} />
            </div>

            <div>
              <span className="ae-label block mb-2">Shape</span>
              <div className="flex gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateObject(selected.id, { shape: s })}
                    className={`flex items-center justify-center h-10 rounded-xl border transition-all text-[10px] font-medium ${
                      selected.shape === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                    style={{ width: s === "pill" ? 56 : 40 }}
                  >
                    {s === "square" && <div className="w-4 h-4 rounded-sm" style={{ background: `hsl(${selected.color})` }} />}
                    {s === "circle" && <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${selected.color})` }} />}
                    {s === "pill" && <div className="w-7 h-3.5 rounded-full" style={{ background: `hsl(${selected.color})` }} />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="ae-label block mb-2">Color</span>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateObject(selected.id, { color: c })}
                    className={`h-7 w-7 rounded-full transition-all ${
                      selected.color === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"
                    }`}
                    style={{ background: `hsl(${c})` }}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="ae-label block mb-2">Easing Preset</span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_PRESETS.map((p) => {
                  const isActive = p.bezier.every((v, i) => Math.abs(v - selected.bezier[i]) < 0.01);
                  return (
                    <button
                      key={p.label}
                      onClick={() => updateObject(selected.id, { bezier: [...p.bezier], label: p.label })}
                      className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium border transition-all ${
                        isActive ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="ae-label block mb-2">Custom Bezier</span>
              <div className="grid grid-cols-4 gap-2">
                {(["x1", "y1", "x2", "y2"] as const).map((key, i) => (
                  <div key={key}>
                    <label className="text-[9px] font-medium text-muted-foreground block mb-1">{key}</label>
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
                      className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Curve Overlay — dark AE panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="ae-panel mb-4">
        <div className="ae-panel-header">
          <span className="ae-label" style={{ color: "hsl(var(--ae-panel-fg) / 0.5)" }}>Curve Overlay</span>
        </div>
        <CurveOverlay objects={objects} selectedId={selectedId} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button onClick={play} className="w-full rounded-2xl py-5 text-sm font-semibold bg-primary hover:bg-primary/90">
          {playing ? "■ Stop Animation" : "▶ Play All Curves"}
        </Button>
      </motion.div>
    </div>
  );
};

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
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad} y1={pad + f * innerH} x2={w - pad} y2={pad + f * innerH} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
          <line x1={pad + f * innerW} y1={pad} x2={pad + f * innerW} y2={h - pad} stroke="hsl(var(--ae-grid))" strokeWidth={0.5} />
        </g>
      ))}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={pad} stroke="hsl(var(--ae-panel-fg) / 0.1)" strokeWidth={1} strokeDasharray="4 4" />
      <text x={pad - 4} y={pad + 3} textAnchor="end" fill="hsl(var(--ae-panel-fg) / 0.4)" fontSize={7} fontFamily="Inter">1</text>
      <text x={pad - 4} y={h - pad + 3} textAnchor="end" fill="hsl(var(--ae-panel-fg) / 0.4)" fontSize={7} fontFamily="Inter">0</text>
      <text x={pad} y={h - pad + 14} textAnchor="middle" fill="hsl(var(--ae-panel-fg) / 0.4)" fontSize={7} fontFamily="Inter">0s</text>
      <text x={w - pad} y={h - pad + 14} textAnchor="middle" fill="hsl(var(--ae-panel-fg) / 0.4)" fontSize={7} fontFamily="Inter">1s</text>

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
          <path key={obj.id} d={pts.join(" ")} fill="none" stroke={`hsl(${obj.color})`} strokeWidth={isSelected ? 2.5 : 1.5} strokeLinecap="round" opacity={isSelected ? 1 : 0.5} />
        );
      })}
    </svg>
  );
}

export default CanvasPage;
