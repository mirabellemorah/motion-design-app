import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Play, Pause } from "lucide-react";
import { lessons, EASING_OPTIONS } from "@/data/lessons";
import AnimationPreview from "@/components/AnimationPreview";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === id);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(lesson?.defaultParams.duration || 0.4);
  const [easing, setEasing] = useState(lesson?.defaultParams.easing || "easeInOut");
  const [delay, setDelay] = useState(lesson?.defaultParams.delay || 0);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Lesson not found</p>
      </div>
    );
  }

  const animType = lesson.id === "squash-stretch" ? "bounce"
    : lesson.id === "arcs" ? "arc"
    : lesson.id === "squash-stretch" || lesson.id === "anticipation" ? "scale"
    : "translate";

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <button onClick={() => navigate("/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Icon & Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col items-center text-center"
      >
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
          lesson.color === "lavender" ? "gradient-lavender" : "gradient-sage"
        }`}>
          <lesson.icon className="h-8 w-8 text-foreground/70" />
        </div>
        <h1 className="text-display text-2xl font-bold">{lesson.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{lesson.subtitle}</p>
      </motion.div>

      {/* What is it? */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-display mb-2 text-sm font-semibold">What is it?</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">{lesson.description}</p>
      </motion.div>

      {/* Animation Preview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-display text-sm font-semibold">See it in action</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPlaying(!playing)}
            className="h-8 gap-1.5 text-xs"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </div>
        <AnimationPreview
          params={{ duration, easing, delay, bounce: lesson.defaultParams.bounce }}
          type={animType}
          playing={playing}
        />
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 space-y-5 rounded-2xl glass-card p-5"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium">Duration</label>
            <span className="text-xs font-mono text-muted-foreground">{duration.toFixed(2)}s</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([v]) => setDuration(v)}
            min={0.1}
            max={2}
            step={0.05}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0s</span><span>0.5s</span><span>1.0s</span><span>1.5s</span><span>2.0s</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-2 block">Easing</label>
          <div className="flex flex-wrap gap-2">
            {EASING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEasing(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  easing === opt.value
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium">Delay</label>
            <span className="text-xs font-mono text-muted-foreground">{delay.toFixed(2)}s</span>
          </div>
          <Slider
            value={[delay]}
            onValueChange={([v]) => setDelay(v)}
            min={0}
            max={1}
            step={0.05}
            className="w-full"
          />
        </div>
      </motion.div>

      {/* Key Principles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-display mb-3 text-sm font-semibold">Key Principles</h2>
        <div className="space-y-2">
          {lesson.keyPrinciples.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
              <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <p className="text-xs leading-relaxed text-foreground/80">{p}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6 rounded-2xl gradient-sage p-4"
      >
        <p className="text-xs font-medium text-success">✦ Good timing for UI!</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/70">{lesson.tip}</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <Button
          onClick={() => navigate(`/practice/${lesson.id}`)}
          className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground"
        >
          ▶ Test Animation
        </Button>
      </motion.div>
    </div>
  );
};

export default LessonDetailPage;
