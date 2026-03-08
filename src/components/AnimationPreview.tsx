import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimationPreviewProps {
  bezier: [number, number, number, number];
  duration?: number;
  playing?: boolean;
  label?: string;
}

const AnimationPreview = ({ bezier, duration = 0.8, playing = false, label }: AnimationPreviewProps) => {
  const [key, setKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (playing) {
      setKey(k => k + 1);
      setAutoPlay(true);
    }
  }, [playing, bezier]);

  // Auto-replay loop
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, (duration + 0.8) * 1000);
    return () => clearInterval(interval);
  }, [autoPlay, duration]);

  return (
    <div className="ae-panel">
      <div className="ae-panel-header justify-between">
        <span className="ae-label">{label || "Preview"}</span>
        <button
          onClick={() => { setAutoPlay(!autoPlay); setKey(k => k + 1); }}
          className="ae-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {autoPlay ? "■ STOP" : "▶ PLAY"}
        </button>
      </div>

      <div className="relative h-28 overflow-hidden bg-card">
        {/* Grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-border" style={{ left: `${(i + 1) * 10}%` }} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-border" style={{ top: `${(i + 1) * 25}%` }} />
          ))}
        </div>

        {/* Floor */}
        <div className="absolute bottom-6 left-6 right-6 h-px bg-border" />

        {/* Animated object */}
        <motion.div
          key={key}
          className="absolute bottom-6 left-6 h-10 w-10 rounded-lg"
          style={{
            background: `linear-gradient(135deg, hsl(var(--ae-yellow)), hsl(var(--ae-orange)))`,
            boxShadow: `0 4px 20px hsl(var(--ae-yellow) / 0.3)`,
          }}
          initial={{ x: 0 }}
          animate={autoPlay ? { x: [0, 200, 0] } : { x: 0 }}
          transition={{
            duration: duration * 2,
            ease: bezier as any,
            times: [0, 0.5, 1],
          }}
        />

        {/* Frame counter */}
        <div className="absolute top-2 right-3 ae-mono text-[9px] text-muted-foreground/40">
          {autoPlay ? "▶" : "■"} {Math.round(duration * 24)}f
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;
