import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { COMMON_PRESETS } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import { Slider } from "@/components/ui/slider";

const CubicBezierLab = () => {
  const [bezier, setBezier] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);
  const [duration, setDuration] = useState(0.8);
  const [trigger, setTrigger] = useState(0);
  const cssValue = `cubic-bezier(${bezier.map((v) => v.toFixed(2)).join(", ")})`;

  return (
    <div className="space-y-3">
      <InteractiveBezierGraph
        bezier={bezier}
        onChange={setBezier}
        width={320}
        height={240}
        label="Drag P1 and P2 — feel the motion change"
        color="var(--ae-yellow)"
      />

      <div className="soft-card p-4 space-y-3">
        <div className="relative h-20 rounded-2xl bg-secondary overflow-hidden">
          <motion.div
            key={`${trigger}-${cssValue}-${duration}`}
            initial={{ x: 0 }}
            animate={{ x: 232 }}
            transition={{ duration, ease: bezier as [number, number, number, number] }}
            className="absolute top-1/2 -translate-y-1/2 left-3 h-12 w-12 rounded-2xl bg-primary"
          />
        </div>
        <button
          onClick={() => setTrigger((t) => t + 1)}
          className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-1.5"
        >
          <Play className="h-3.5 w-3.5" /> Replay animation
        </button>
      </div>

      <div className="soft-card p-4 space-y-3">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="ae-label">Duration</span>
            <span className="text-xs font-medium text-primary">{duration.toFixed(2)}s</span>
          </div>
          <Slider value={[duration]} onValueChange={([v]) => setDuration(v)} min={0.1} max={2} step={0.05} />
        </div>
        <div>
          <span className="ae-label block mb-2">Presets</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PRESETS.map((p) => {
              const active = p.bezier.every((v, i) => Math.abs(v - bezier[i]) < 0.01);
              return (
                <button
                  key={p.label}
                  onClick={() => setBezier([...p.bezier])}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium border transition-all ${
                    active
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
        <div className="rounded-xl bg-secondary px-3 py-2 font-mono text-[11px] text-foreground/80 break-all">
          {cssValue}
        </div>
      </div>
    </div>
  );
};

export default CubicBezierLab;