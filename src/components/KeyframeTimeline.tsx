import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack } from "lucide-react";

interface Keyframe {
  time: number; // 0-1 normalized
  label: string;
  color: string;
}

interface KeyframeTimelineProps {
  duration: number;
  delay: number;
  playing: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  keyframes?: Keyframe[];
}

const DEFAULT_KEYFRAMES: Keyframe[] = [
  { time: 0, label: "Start", color: "hsl(var(--xp-gold))" },
  { time: 1, label: "End", color: "hsl(var(--xp-gold))" },
];

const KeyframeTimeline = ({
  duration,
  delay,
  playing,
  onTogglePlay,
  onReset,
  keyframes = DEFAULT_KEYFRAMES,
}: KeyframeTimelineProps) => {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const totalDuration = duration + delay;
    const p = Math.min(elapsed / totalDuration, 1);
    setProgress(p);

    if (p < 1) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      startTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
  }, [duration, delay]);

  useEffect(() => {
    if (playing) {
      startTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing, animate]);

  const totalFrames = Math.round((duration + delay) * 24);
  const currentFrame = Math.round(progress * totalFrames);

  // Generate frame markers
  const markers = [];
  const step = totalFrames <= 24 ? 1 : totalFrames <= 48 ? 2 : 4;
  for (let i = 0; i <= totalFrames; i += step) {
    markers.push(i);
  }

  return (
    <div className="rounded-xl border border-border/60 bg-[hsl(260,20%,6%)] overflow-hidden">
      {/* Transport controls */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 bg-[hsl(260,15%,10%)]">
        <button
          onClick={onReset}
          className="p-1 rounded hover:bg-[hsl(260,15%,18%)] transition-colors"
        >
          <SkipBack className="h-3 w-3 text-muted-foreground" />
        </button>
        <button
          onClick={onTogglePlay}
          className="p-1 rounded hover:bg-[hsl(260,15%,18%)] transition-colors"
        >
          {playing ? (
            <Pause className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Play className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1" />
        <span className="text-[10px] font-mono text-[hsl(var(--xp-gold))]">
          {String(currentFrame).padStart(3, "0")}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          / {String(totalFrames).padStart(3, "0")} f
        </span>
        <span className="text-[10px] font-mono text-muted-foreground ml-2">
          {(progress * (duration + delay)).toFixed(2)}s
        </span>
      </div>

      {/* Timeline ruler */}
      <div className="px-3 py-1 border-b border-border/20 bg-[hsl(260,15%,8%)]">
        <div className="relative h-4">
          {markers.map((frame) => (
            <div
              key={frame}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(frame / totalFrames) * 100}%` }}
            >
              <div className="h-2 w-px bg-muted-foreground/30" />
              {frame % (step * 2) === 0 && (
                <span className="text-[7px] font-mono text-muted-foreground/50 mt-0.5">{frame}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layers */}
      <div className="px-3 py-2 space-y-1">
        {/* Transform layer */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground w-16 truncate">Transform</span>
          <div className="flex-1 relative h-5 bg-[hsl(260,15%,10%)] rounded-sm">
            {/* Delay region */}
            {delay > 0 && (
              <div
                className="absolute top-0 bottom-0 bg-[hsl(260,15%,14%)] rounded-l-sm"
                style={{ width: `${(delay / (duration + delay)) * 100}%` }}
              />
            )}
            {/* Active region */}
            <div
              className="absolute top-0 bottom-0 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.4)] rounded-sm"
              style={{
                left: `${(delay / (duration + delay)) * 100}%`,
                width: `${(duration / (duration + delay)) * 100}%`,
              }}
            />
            {/* Keyframe diamonds */}
            {keyframes.map((kf, i) => {
              const pos = ((delay + kf.time * duration) / (duration + delay)) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <div
                    className="h-2.5 w-2.5 rotate-45 rounded-[1px]"
                    style={{ backgroundColor: kf.color }}
                  />
                </div>
              );
            })}
            {/* Playhead */}
            <motion.div
              className="absolute top-0 bottom-0 w-px bg-[hsl(var(--destructive))]"
              style={{ left: `${progress * 100}%` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 w-2 h-1.5 bg-[hsl(var(--destructive))] rounded-t-sm" />
            </motion.div>
          </div>
        </div>

        {/* Position layer */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground/60 w-16 truncate pl-3">Position</span>
          <div className="flex-1 relative h-4 bg-[hsl(260,15%,9%)] rounded-sm">
            {keyframes.map((kf, i) => {
              const pos = ((delay + kf.time * duration) / (duration + delay)) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <div className="h-2 w-2 rotate-45 rounded-[1px] bg-[hsl(var(--success))]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Opacity layer */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground/60 w-16 truncate pl-3">Opacity</span>
          <div className="flex-1 relative h-4 bg-[hsl(260,15%,9%)] rounded-sm">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${(delay / (duration + delay)) * 100}%` }}
            >
              <div className="h-2 w-2 rotate-45 rounded-[1px] bg-[hsl(var(--primary))]" />
            </div>
          </div>
        </div>

        {/* Scale layer */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground/60 w-16 truncate pl-3">Scale</span>
          <div className="flex-1 relative h-4 bg-[hsl(260,15%,9%)] rounded-sm">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${(delay / (duration + delay)) * 100}%` }}
            >
              <div className="h-2 w-2 rotate-45 rounded-[1px] bg-[hsl(260,60%,70%)]" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: "100%" }}
            >
              <div className="h-2 w-2 rotate-45 rounded-[1px] bg-[hsl(260,60%,70%)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyframeTimeline;
