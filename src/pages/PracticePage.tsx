import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { lessons, EASING_OPTIONS } from "@/data/lessons";
import AnimationPreview from "@/components/AnimationPreview";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = id ? lessons.find((l) => l.id === id) : lessons[0];

  // Target params (what user needs to match)
  const target = useMemo(() => lesson ? {
    duration: lesson.defaultParams.duration + (Math.random() * 0.3 - 0.15),
    easing: lesson.defaultParams.easing,
    delay: Math.round(Math.random() * 3) * 0.1,
  } : { duration: 0.4, easing: "easeOut", delay: 0 }, [lesson]);

  const [userDuration, setUserDuration] = useState(0.5);
  const [userEasing, setUserEasing] = useState("linear");
  const [userDelay, setUserDelay] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [targetPlaying, setTargetPlaying] = useState(true);
  const [userPlaying, setUserPlaying] = useState(true);

  const calculateScore = () => {
    const durationDiff = Math.abs(target.duration - userDuration);
    const durationScore = Math.max(0, 100 - durationDiff * 200);
    const easingScore = target.easing === userEasing ? 100 : 30;
    const delayDiff = Math.abs(target.delay - userDelay);
    const delayScore = Math.max(0, 100 - delayDiff * 300);
    return Math.round((durationScore + easingScore + delayScore) / 3);
  };

  const handleSubmit = () => {
    const s = calculateScore();
    setScore(s);
    setSubmitted(true);
  };

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Select a lesson first</p>
        <Button onClick={() => navigate("/lessons")} className="ml-4">Browse Lessons</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4 flex items-center gap-3"
      >
        <button onClick={() => navigate(id ? `/lesson/${id}` : "/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-display text-lg font-bold">{lesson.title}</h1>
          <p className="text-xs text-muted-foreground">Apply what you learned</p>
        </div>
      </motion.div>

      {!submitted ? (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-xs text-muted-foreground"
          >
            Adjust the timing to make this animation feel natural — not too fast, not too slow.
          </motion.p>

          {/* Target Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</p>
            <AnimationPreview
              params={target}
              type="translate"
              playing={targetPlaying}
            />
          </motion.div>

          {/* User Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your attempt</p>
            <AnimationPreview
              params={{ duration: userDuration, easing: userEasing, delay: userDelay }}
              type="translate"
              playing={userPlaying}
            />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 space-y-4 rounded-2xl glass-card p-5"
          >
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium">Duration</label>
                <span className="text-xs font-mono text-muted-foreground">{userDuration.toFixed(2)}s</span>
              </div>
              <Slider value={[userDuration]} onValueChange={([v]) => setUserDuration(v)} min={0.1} max={2} step={0.05} />
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block">Easing</label>
              <div className="flex flex-wrap gap-2">
                {EASING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUserEasing(opt.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      userEasing === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium">Delay</label>
                <span className="text-xs font-mono text-muted-foreground">{userDelay.toFixed(2)}s</span>
              </div>
              <Slider value={[userDelay]} onValueChange={([v]) => setUserDelay(v)} min={0} max={1} step={0.05} />
            </div>
          </motion.div>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-5 rounded-xl gradient-sage px-4 py-3"
          >
            <p className="text-xs leading-relaxed text-foreground/70">
              <span className="font-semibold text-success">Tip: </span>{lesson.tip}
            </p>
          </motion.div>

          <Button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground"
          >
            <Check className="mr-2 h-4 w-4" />
            Submit Answer
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center pt-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              score >= 70 ? "bg-success" : score >= 40 ? "bg-xp-gold" : "bg-destructive"
            }`}
          >
            <span className="text-3xl font-bold text-primary-foreground">{score >= 70 ? "🎉" : score >= 40 ? "👍" : "💪"}</span>
          </motion.div>

          <h2 className="text-display text-2xl font-bold mb-2">
            {score >= 70 ? "Great job!" : score >= 40 ? "Not bad!" : "Keep practicing!"}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            You scored {score}% on the {lesson.title} challenge
          </p>

          <div className="mb-8 flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{score}%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">+{Math.round(score / 10) * 10}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate("/lessons")}
              className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground"
            >
              Continue Learning
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSubmitted(false);
                setUserDuration(0.5);
                setUserEasing("linear");
                setUserDelay(0);
              }}
              className="w-full rounded-xl py-6 text-sm"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PracticePage;
