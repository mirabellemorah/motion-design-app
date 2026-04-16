import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, RotateCw, CheckCircle } from "lucide-react";
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
          <h1 className="text-base font-semibold text-foreground">
            {lesson ? `Practice: ${lesson.title}` : "Curve Challenge"}
          </h1>
          <p className="text-xs text-muted-foreground">Match the green target curve</p>
        </div>
      </motion.div>

      {!submitted ? (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-3">
            <span className="ae-label block mb-1.5">Target Animation</span>
            <AnimationPreview bezier={target} duration={0.7} playing label="Target" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-3">
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
            <AnimationPreview bezier={userBezier} duration={0.7} playing label="Your Curve" />
          </motion.div>

          {lesson && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4 soft-card p-4 border-l-4 border-l-primary">
              <p className="text-[10px] font-semibold mb-1 text-primary uppercase tracking-wider">HINT</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{lesson.tip}</p>
            </motion.div>
          )}

          <Button onClick={handleSubmit} className="w-full rounded-2xl py-5 text-sm font-semibold bg-primary hover:bg-primary/90">
            Check My Curve →
          </Button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-4">
          {/* Score — celebratory feedback */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 bg-primary/10"
            >
              <CheckCircle className="h-10 w-10 text-primary" />
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {score >= 80 ? "Great job!" : score >= 50 ? "Getting there!" : "Keep practicing!"}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              {score >= 80 ? "Your curve closely matches the target." : "Try adjusting both control points to match the target shape."}
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{score}%</p>
                <p className="ae-label mt-0.5">ACCURACY</p>
              </div>
            </div>
          </div>

          {/* Comparison — dark AE panel */}
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

          {/* Values — light card */}
          <div className="soft-card p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="ae-label block mb-1">YOUR CURVE</span>
                <span className="text-xs font-medium text-primary">
                  ({userBezier.map(v => v.toFixed(2)).join(", ")})
                </span>
              </div>
              <div>
                <span className="ae-label block mb-1">TARGET</span>
                <span className="text-xs font-medium text-foreground">
                  ({target.map(v => v.toFixed(2)).join(", ")})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full rounded-2xl py-5 text-sm font-semibold bg-primary hover:bg-primary/90 gap-2">
              <RotateCw className="h-4 w-4" /> Try Again
            </Button>
            <button
              onClick={() => navigate("/lessons")}
              className="w-full py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
