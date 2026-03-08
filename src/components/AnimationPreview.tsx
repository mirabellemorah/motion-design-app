import { motion } from "framer-motion";
import { AnimationParams } from "@/data/lessons";

interface AnimationPreviewProps {
  params: AnimationParams;
  type?: "translate" | "bounce" | "scale" | "arc";
  playing: boolean;
  onComplete?: () => void;
}

const AnimationPreview = ({ params, type = "translate", playing, onComplete }: AnimationPreviewProps) => {
  const getAnimationProps = () => {
    const transition = params.easing === "spring"
      ? { type: "spring", stiffness: params.stiffness || 200, damping: 15, bounce: params.bounce || 0.3 }
      : { duration: params.duration, ease: params.easing, delay: params.delay };

    switch (type) {
      case "bounce":
        return {
          animate: playing
            ? { y: [0, -80, 0], scaleX: [1, 0.9, 1.1, 1], scaleY: [1, 1.1, 0.9, 1] }
            : { y: 0, scaleX: 1, scaleY: 1 },
          transition: { ...transition, y: { ...transition, repeat: playing ? Infinity : 0, repeatDelay: 0.5 } },
        };
      case "scale":
        return {
          animate: playing
            ? { scale: [1, 1.3, 0.9, 1.05, 1] }
            : { scale: 1 },
          transition,
        };
      case "arc":
        return {
          animate: playing
            ? { x: [0, 60, 120], y: [0, -60, 0] }
            : { x: 0, y: 0 },
          transition,
        };
      default:
        return {
          animate: playing
            ? { x: [0, 140, 0] }
            : { x: 0 },
          transition: { ...transition, repeat: playing ? Infinity : 0, repeatDelay: 0.3 },
        };
    }
  };

  const animProps = getAnimationProps();

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
        {...animProps}
        onAnimationComplete={onComplete}
      />
    </div>
  );
};

export default AnimationPreview;
