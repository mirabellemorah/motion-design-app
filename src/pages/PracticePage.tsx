import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, RotateCw } from "lucide-react";
import { lessons } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import AnimationPreview from "@/components/AnimationPreview";
import { Button } from "@/components/ui/button";

function scoreCurve(user: [number, number, number, number], target: [number, number, number, number]): number {
  const diff = user.reduce((sum, v, i) => sum + Math.abs(v - target[i]), 0);
  return Math.max(0, Math.round(100 - diff * 40));
}

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = id ? lessons.find((l) => l.id === id) : null;

  const target = useMemo<[number, number, number, number]>(() => {
    if (lesson?.targetBezier) return lesson.targetBezier;
    // Random practice curve
    return [
      Math.round(Math.random() * 60) / 100,
      Math.round(Math.random() * 100) / 100,
      Math.round((30 + Math.random() * 70)) / 100,
      Math.round((80 + Math.random() * 40)) / 100,
    ];
  }, [lesson]);

  const [userBezier, setUserBezier] = useState<[number, number, number, number]>([0.25, 0.25, 0.75, 0.75]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    setScore(scoreCurve(userBezier, target));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserBezier([0.25, 0.25, 0.75, 0.75]);
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(lesson ? `/lesson/${lesson.id}` : "/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold">
            {lesson ? `Practice: ${lesson.title}` : "Curve Challenge"}
          </h1>
          <p className="text-[11px] text-muted-foreground">Match the green target curve</p>
        </div>
      </motion.div>

      {!submitted ? (
        <>
          {/* Target preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-3"
          >
            <span className="ae-label block mb-1.5">Target Animation</span>
            <AnimationPreview bezier={target} duration={0.7} playing label="Target" />
          </motion.div>

          {/* Interactive graph with target overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3"
          >
            <InteractiveBezierGraph
              bezier={userBezier}
              onChange={setUserBezier}
              targetBezier={target}
              width={320}
              height={260}
              label="Your Curve — Match the green target"
              color="var(--ae-yellow)"
            />
          </motion.div>

          {/* Your preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <AnimationPreview bezier={userBezier} duration={0.7} playing label="Your Curve" />
          </motion.div>

          {/* Hint */}
          {lesson && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 ae-panel p-3 border-l-2"
              style={{ borderLeftColor: "hsl(var(--ae-green))" }}
            >
              <p className="ae-mono text-[10px] mb-1" style={{ color: "hsl(var(--ae-green))" }}>HINT</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{lesson.tip}</p>
            </motion.div>
          )}

          <Button onClick={handleSubmit} className="w-full rounded-lg py-5 text-sm font-medium">
            Check My Curve →
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pt-4"
        >
          {/* Score */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="inline-flex items-center justify-center h-24 w-24 rounded-full mb-4"
              style={{
                background: score >= 80
                  ? "hsl(var(--ae-green) / 0.15)"
                  : score >= 50
                  ? "hsl(var(--ae-yellow) / 0.15)"
                  : "hsl(var(--ae-red) / 0.15)",
                border: `2px solid ${score >= 80 ? "hsl(var(--ae-green))" : score >= 50 ? "hsl(var(--ae-yellow))" : "hsl(var(--ae-red))"}`,
              }}
            >
              <span className="text-3xl font-bold" style={{
                color: score >= 80 ? "hsl(var(--ae-green))" : score >= 50 ? "hsl(var(--ae-yellow))" : "hsl(var(--ae-red))",
              }}>
                {score}%
              </span>
            </motion.div>
            <h2 className="text-lg font-semibold mb-1">
              {score >= 80 ? "Excellent!" : score >= 50 ? "Getting there!" : "Keep practicing!"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {score >= 80 ? "Your curve closely matches the target." : "Try adjusting both control points to match the target shape."}
            </p>
          </div>

          {/* Comparison */}
          <div className="mb-4">
            <InteractiveBezierGraph
              bezier={userBezier}
              targetBezier={target}
              width={320}
              height={220}
              interactive={false}
              label="Comparison"
              color="var(--ae-yellow)"
              showSpeed={false}
            />
          </div>

          {/* Values comparison */}
          <div className="ae-panel p-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="ae-mono text-[9px] text-muted-foreground block mb-1">YOUR CURVE</span>
                <span className="ae-mono text-[11px]" style={{ color: "hsl(var(--ae-yellow))" }}>
                  ({userBezier.map(v => v.toFixed(2)).join(", ")})
                </span>
              </div>
              <div>
                <span className="ae-mono text-[9px] text-muted-foreground block mb-1">TARGET</span>
                <span className="ae-mono text-[11px]" style={{ color: "hsl(var(--ae-green))" }}>
                  ({target.map(v => v.toFixed(2)).join(", ")})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full rounded-lg py-5 text-sm font-medium gap-2">
              <RotateCw className="h-4 w-4" /> Try Again
            </Button>
            <button
              onClick={() => navigate("/lessons")}
              className="w-full py-3 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Lessons
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PracticePage;
