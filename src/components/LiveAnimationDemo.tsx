import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Timer, Zap, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { COMMON_PRESETS } from "@/data/lessons";

interface LiveAnimationDemoProps {
  /** Initial bezier override (e.g. from lesson default) */
  initialBezier?: [number, number, number, number];
  /** Show easing presets section */
  showPresets?: boolean;
}

const SHAPES = [
  { id: "circle", label: "○", className: "rounded-full w-10 h-10", color: "hsl(var(--ae-yellow))", shadow: "hsl(var(--ae-yellow)/0.4)" },
  { id: "square", label: "□", className: "rounded-xl w-10 h-10", color: "hsl(265 60% 70%)", shadow: "hsl(265 60% 70%/0.4)" },
  { id: "pill", label: "▬", className: "rounded-full w-16 h-5", color: "hsl(var(--ae-green))", shadow: "hsl(var(--ae-green)/0.4)" },
];

const LiveAnimationDemo = ({ initialBezier, showPresets = true }: LiveAnimationDemoProps) => {
  const [bezier, setBezier] = useState<[number, number, number, number]>(
    initialBezier ?? [0, 0, 0.58, 1]
  );
  const [duration, setDuration] = useState(0.6);
  const [delay, setDelay] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Sync with initialBezier changes (e.g. from lesson page)
  useEffect(() => {
    if (initialBezier) setBezier(initialBezier);
  }, [initialBezier?.join(",")]);

  // Auto-find active preset
  useEffect(() => {
    const found = COMMON_PRESETS.find((p) =>
      p.bezier.every((v, i) => Math.abs(v - bezier[i]) < 0.01)
    );
    setActivePreset(found?.label ?? null);
  }, [bezier]);

  const replay = useCallback(() => {
    setIsPlaying(false);
    setTimeout(() => {
      setPlayKey((k) => k + 1);
      setIsPlaying(true);
    }, 20);
  }, []);

  // Auto-loop
  useEffect(() => {
    if (!isPlaying) return;
    const totalMs = (delay + duration + 0.5) * 1000;
    const t = setTimeout(() => {
      setPlayKey((k) => k + 1);
    }, totalMs);
    return () => clearTimeout(t);
  }, [isPlaying, playKey, duration, delay]);

  const bezierStr = `cubic-bezier(${bezier.map((v) => +v.toFixed(3)).join(", ")})`;

  return (
    <div className="rounded-[2rem] border-2 border-border overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b-2 border-border bg-ink">
        <div className="flex items-center gap-2">
          <span className="sticker sticker-lime">LIVE DEMO</span>
          <span className="text-white/40 text-[10px] font-mono hidden sm:block">{bezierStr}</span>
        </div>
        <button
          onClick={replay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime text-lime-foreground text-[10px] font-black uppercase tracking-wide hover:bg-white transition-colors"
        >
          {isPlaying ? <RotateCcw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {isPlaying ? "REPLAY" : "PLAY"}
        </button>
      </div>

      {/* Animation stage */}
      <div className="relative bg-[hsl(220_15%_9%)] overflow-hidden" style={{ height: 180 }}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-white/30" style={{ left: `${(i + 1) * (100 / 13)}%` }} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`h${i}`} className="absolute left-0 right-0 border-t border-white/30" style={{ top: `${(i + 1) * 25}%` }} />
          ))}
        </div>

        {/* Rail lines */}
        {SHAPES.map((s, i) => (
          <div
            key={`rail-${s.id}`}
            className="absolute left-8 right-8 h-px"
            style={{
              top: `${28 + i * 50}px`,
              background: `${s.color}22`,
            }}
          />
        ))}

        {/* Animated shapes */}
        {SHAPES.map((s, i) => (
          <motion.div
            key={`${s.id}-${playKey}`}
            className={`absolute ${s.className} flex-shrink-0`}
            style={{
              top: `${28 + i * 50 - (s.id === "pill" ? 10 : 20)}px`,
              left: 32,
              background: s.color,
              boxShadow: `0 4px 20px ${s.shadow}`,
            }}
            initial={{ x: 0, opacity: 0.4 }}
            animate={isPlaying ? { x: "calc(100vw - 96px)", opacity: 1 } : { x: 0, opacity: 0.4 }}
            transition={{
              duration,
              delay: delay + i * 0.04,
              ease: bezier as [number, number, number, number],
            }}
          />
        ))}

        {/* Labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around py-4">
          {SHAPES.map((s) => (
            <span key={s.id} className="text-[10px] font-mono text-white/20 text-center">{s.label}</span>
          ))}
        </div>

        {/* Duration overlay */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
          <span className="ae-mono text-[9px] text-white/30">{Math.round(duration * 24)}f</span>
          <span className="ae-mono text-[9px] text-white/30">{duration.toFixed(2)}s</span>
        </div>

        {/* Tap to play cue when stopped */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={replay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Play className="h-4 w-4 text-lime" />
                <span className="text-white text-xs font-bold uppercase tracking-wide">Tap to preview</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-5 space-y-5 bg-secondary/30">
        {/* Easing presets */}
        {showPresets && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Zap className="h-3 w-3 text-primary" />
              <span className="ae-label">Easing</span>
              {activePreset && <span className="text-[10px] text-primary font-bold ml-1">— {activePreset}</span>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p) => {
                const isActive = p.label === activePreset;
                return (
                  <button
                    key={p.label}
                    onClick={() => setBezier([...p.bezier] as [number, number, number, number])}
                    className={`rounded-xl px-3 py-1.5 text-[10px] font-bold border transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-accent hover:border-primary/40"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Duration slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Timer className="h-3 w-3 text-primary" />
              <span className="ae-label">Duration</span>
            </div>
            <span className="text-xs font-black text-primary">{duration.toFixed(2)}s</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([v]) => { setDuration(v); if (isPlaying) replay(); }}
            min={0.1}
            max={3}
            step={0.05}
            className="[&_[role=slider]]:bg-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground">0.1s</span>
            <span className="text-[9px] text-muted-foreground">3s</span>
          </div>
        </div>

        {/* Delay slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              <span className="ae-label">Delay</span>
            </div>
            <span className="text-xs font-black text-primary">{delay.toFixed(2)}s</span>
          </div>
          <Slider
            value={[delay]}
            onValueChange={([v]) => setDelay(v)}
            min={0}
            max={1}
            step={0.05}
            className="[&_[role=slider]]:bg-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground">0s</span>
            <span className="text-[9px] text-muted-foreground">1s</span>
          </div>
        </div>

        {/* CSS output */}
        <div className="rounded-2xl bg-ink px-4 py-3">
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-1">CSS Output</p>
          <p className="text-[11px] font-mono text-lime break-all leading-relaxed">
            transition: all {duration.toFixed(2)}s {bezierStr} {delay > 0 ? `${delay.toFixed(2)}s` : ""};
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveAnimationDemo;
