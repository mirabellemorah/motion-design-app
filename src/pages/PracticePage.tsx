import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, RotateCw, CheckCircle, Flame, Sparkles, Trophy, Zap, Target as TargetIcon } from "lucide-react";
import { lessons } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import AnimationPreview from "@/components/AnimationPreview";
import { Button } from "@/components/ui/button";
import CurveZoomModal from "@/components/CurveZoomModal";

function scoreCurve(user: [number, number, number, number], target: [number, number, number, number]): number {
  const diff = user.reduce((sum, v, i) => sum + Math.abs(v - target[i]), 0);
  return Math.max(0, Math.round(100 - diff * 40));
}

function tier(score: number) {
  if (score >= 90) return { label: "PLATINUM", color: "hsl(265 60% 65%)", Icon: Trophy };
  if (score >= 75) return { label: "GOLD", color: "hsl(48 100% 55%)", Icon: Trophy };
  if (score >= 55) return { label: "SILVER", color: "hsl(220 10% 65%)", Icon: TargetIcon };
  return { label: "BRONZE", color: "hsl(30 60% 55%)", Icon: Zap };
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
  const [zoomOpen, setZoomOpen] = useState(false);

  const handleSubmit = () => {
    setScore(scoreCurve(userBezier, target));
    setSubmitted(true);
  };

  const handleRetry = () => {
    setUserBezier([0.25, 0.25, 0.75, 0.75]);
    setSubmitted(false);
    setScore(0);
  };

  const xpEarned = Math.round(score / 5) * 5;
  const t = tier(score);
  const TierIcon = t.Icon;

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(lesson ? `/lesson/${lesson.id}` : "/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground">
            {lesson ? `Practice: ${lesson.title}` : "Curve Challenge"}
          </h1>
          <p className="text-xs text-muted-foreground">Match the green target curve</p>
        </div>
        {!submitted && (
          <div className="flex items-center gap-1 rounded-full bg-[hsl(var(--ae-orange)/0.12)] text-[hsl(var(--ae-orange))] px-2 py-1">
            <Flame className="h-3 w-3" />
            <span className="text-[11px] font-semibold">7</span>
          </div>
        )}
      </motion.div>

      {!submitted ? (
        <>
          {/* Reward preview banner — psychological hook */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-2xl px-3 py-2.5 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.12), hsl(var(--ae-yellow)/0.12))" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-foreground">
                Match 90%+ to unlock <span className="text-primary font-semibold">Platinum</span>
              </p>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">+20 XP</span>
          </motion.div>

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
              onZoom={() => setZoomOpen(true)}
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

          <Button onClick={handleSubmit} className="w-full rounded-2xl py-6 text-sm font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Sparkles className="h-4 w-4" /> Lock In My Curve
          </Button>

          <CurveZoomModal
            open={zoomOpen}
            onOpenChange={setZoomOpen}
            bezier={userBezier}
            onChange={setUserBezier}
            targetBezier={target}
            label="Match the target — Fullscreen"
          />
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-4">
          {/* Confetti burst for high scores */}
          {score >= 75 && (
            <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-center overflow-hidden h-40">
              {Array.from({ length: 24 }).map((_, i) => {
                const colors = ["hsl(var(--primary))", "hsl(var(--ae-yellow))", "hsl(var(--ae-orange))", "hsl(var(--ae-green))"];
                return (
                  <motion.div
                    key={i}
                    initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      y: 200 + Math.random() * 100,
                      x: (Math.random() - 0.5) * 320,
                      opacity: 0,
                      rotate: Math.random() * 540,
                    }}
                    transition={{ duration: 1.6 + Math.random() * 0.8, ease: "easeOut" }}
                    className="absolute h-2 w-2 rounded-sm"
                    style={{ background: colors[i % colors.length] }}
                  />
                );
              })}
            </div>
          )}

          {/* Score — celebratory feedback */}
          <div className="text-center mb-6 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="inline-flex items-center justify-center h-24 w-24 rounded-full mb-4 relative"
              style={{ background: `radial-gradient(circle, ${t.color}33 0%, transparent 70%)` }}
            >
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` }}
              >
                <TierIcon className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1 mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest"
              style={{ background: `${t.color}22`, color: t.color }}
            >
              {t.label} TIER
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {score >= 90 ? "Pixel perfect!" : score >= 75 ? "You're on fire!" : score >= 50 ? "Getting there!" : "Almost — try again!"}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              {score >= 80 ? "Your curve closely matches the target." : "Try adjusting both control points to match the target shape."}
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-3xl font-bold text-foreground"
                >
                  {score}%
                </motion.p>
                <p className="ae-label mt-0.5">ACCURACY</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl font-bold text-primary inline-flex items-center gap-1"
                >
                  +{xpEarned}
                </motion.p>
                <p className="ae-label mt-0.5">XP EARNED</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[hsl(var(--ae-orange))] inline-flex items-center gap-1">
                  <Flame className="h-5 w-5" />8
                </p>
                <p className="ae-label mt-0.5">STREAK</p>
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
              onZoom={() => setZoomOpen(true)}
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

          <CurveZoomModal
            open={zoomOpen}
            onOpenChange={setZoomOpen}
            bezier={userBezier}
            targetBezier={target}
            label="Comparison — Fullscreen"
          />
        </motion.div>
      )}
    </div>
  );
};

export default PracticePage;
