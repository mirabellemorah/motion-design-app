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

  const getAnimateProps = () => {
    switch (type) {
      case "bounce":
        return playing
          ? { y: [0, -80, 0], scaleX: [1, 0.9, 1.1, 1], scaleY: [1, 1.1, 0.9, 1] }
          : { y: 0, scaleX: 1, scaleY: 1 };
      case "scale":
        return playing
          ? { scale: [1, 1.3, 0.9, 1.05, 1] }
          : { scale: 1 };
      case "arc":
        return playing
          ? { x: [0, 60, 120], y: [0, -60, 0] }
          : { x: 0, y: 0 };
      default:
        return playing
          ? { x: [0, 140, 0] }
          : { x: 0 };
    }
  };

  return (
    <div className="relative flex h-32 items-center justify-start overflow-hidden rounded-xl bg-muted/50 px-8">
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-border/50"
            style={{ left: `${(i + 1) * 12.5}%` }}
          />
        ))}
      </div>
      <motion.div
        className="relative z-10 h-12 w-12 rounded-xl bg-primary shadow-lg"
        animate={getAnimateProps()}
        transition={{
          duration,
          ease,
          delay,
          repeat: playing ? Infinity : 0,
          repeatDelay: 0.5,
        }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
};

export default AnimationPreview;
