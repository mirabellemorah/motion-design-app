import { motion } from "framer-motion";
import { AnimationParams } from "@/data/lessons";

interface AnimationPreviewProps {
  params: AnimationParams;
  type?: "translate" | "bounce" | "scale" | "arc";
  playing: boolean;
  onComplete?: () => void;
}

const AnimationPreview = ({ params, type = "translate", playing, onComplete }: AnimationPreviewProps) => {
  const duration = params.duration;
  const ease = params.easing === "spring" ? "easeInOut" : params.easing as any;
  const delay = params.delay;
  const bounce = params.bounce ?? 0.3;

  const getAnimateProps = () => {
    switch (type) {
      case "bounce":
        // Improved squash & stretch — exaggerated volume preservation
        return playing
          ? {
              y: [0, -5, -90, -70, -90, -40, -10, 0, 0],
              scaleX: [1, 1.15, 0.85, 0.95, 0.88, 1.05, 1.12, 1.2, 1],
              scaleY: [1, 0.85, 1.2, 1.05, 1.15, 0.92, 0.85, 0.75, 1],
            }
          : { y: 0, scaleX: 1, scaleY: 1 };
      case "scale":
        return playing
          ? { scale: [1, 0.92, 1.15, 0.97, 1.03, 1] }
          : { scale: 1 };
      case "arc":
        return playing
          ? { x: [0, 40, 80, 120], y: [0, -70, -70, 0] }
          : { x: 0, y: 0 };
      default:
        return playing
          ? { x: [0, 140, 0] }
          : { x: 0 };
    }
  };

  const getTransition = () => {
    if (type === "bounce") {
      return {
        duration: duration * 2,
        ease: [0.22, 1, 0.36, 1],
        delay,
        repeat: playing ? Infinity : 0,
        repeatDelay: 0.8,
        times: [0, 0.05, 0.3, 0.45, 0.55, 0.7, 0.85, 0.92, 1],
      };
    }
    return {
      duration,
      ease,
      delay,
      repeat: playing ? Infinity : 0,
      repeatDelay: 0.5,
    };
  };

  return (
    <div className="relative flex h-36 items-end justify-start overflow-hidden rounded-xl bg-[hsl(260,20%,6%)] border border-border/40 px-8 pb-4">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 border-l border-muted-foreground/20"
            style={{ left: `${(i + 1) * (100 / 13)}%` }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 border-t border-muted-foreground/20"
            style={{ top: `${(i + 1) * (100 / 7)}%` }}
          />
        ))}
      </div>

      {/* Floor line */}
      <div className="absolute bottom-4 left-8 right-8 h-px bg-muted-foreground/30" />

      {/* Shadow */}
      {type === "bounce" && playing && (
        <motion.div
          className="absolute bottom-3 left-8 h-2 w-12 rounded-full bg-primary/20 blur-sm"
          animate={playing ? { 
            scaleX: [1, 0.6, 1.3, 0.8, 1.2, 1],
            opacity: [0.3, 0.15, 0.4, 0.2, 0.35, 0.3],
          } : {}}
          transition={{
            duration: duration * 2,
            repeat: Infinity,
            repeatDelay: 0.8,
            times: [0, 0.3, 0.55, 0.7, 0.92, 1],
          }}
        />
      )}

      <motion.div
        className="relative z-10 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--lavender-dark))] shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        animate={getAnimateProps()}
        transition={getTransition()}
        onAnimationComplete={onComplete}
        style={{ transformOrigin: "center bottom" }}
      />

      {/* AE-style frame counter */}
      <div className="absolute top-2 right-3 text-[9px] font-mono text-muted-foreground/40">
        {playing ? "▶" : "■"} {Math.round(duration * 24)}f
      </div>
    </div>
  );
};

export default AnimationPreview;
