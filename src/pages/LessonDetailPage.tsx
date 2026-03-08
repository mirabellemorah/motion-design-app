import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Play, Pause, Zap } from "lucide-react";
import { lessons, EASING_OPTIONS } from "@/data/lessons";
import AnimationPreview from "@/components/AnimationPreview";
import EasingCurveGraph from "@/components/EasingCurveGraph";
import ValueGraph from "@/components/ValueGraph";
import KeyframeTimeline from "@/components/KeyframeTimeline";
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
    : lesson.id === "anticipation" ? "scale"
    : "translate";

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-5 flex items-center gap-3"
      >
        <button onClick={() => navigate("/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-display text-lg font-bold">{lesson.title}</h1>
          <p className="text-[11px] text-muted-foreground">{lesson.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[hsl(var(--xp-gold)/0.15)] px-2.5 py-1">
          <Zap className="h-3 w-3 text-[hsl(var(--xp-gold))]" />
          <span className="text-[10px] font-semibold text-[hsl(var(--xp-gold))]">+50 XP</span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-5 text-xs leading-relaxed text-muted-foreground"
      >
        {lesson.description}
      </motion.p>

      {/* Animation Stage */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Composition</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPlaying(!playing)}
            className="h-7 gap-1 text-[10px] font-mono"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {playing ? "STOP" : "PLAY"}
          </Button>
        </div>
        <AnimationPreview
          params={{ duration, easing, delay, bounce: lesson.defaultParams.bounce }}
          type={animType}
          playing={playing}
        />
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <KeyframeTimeline
          duration={duration}
          delay={delay}
          playing={playing}
          onTogglePlay={() => setPlaying(!playing)}
          onReset={() => setPlaying(false)}
        />
      </motion.div>

      {/* Graphs side by side on larger screens, stacked on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4 space-y-3"
      >
        <EasingCurveGraph easing={easing} duration={duration} />
        <ValueGraph easing={easing} duration={duration} />
      </motion.div>

      {/* Controls Panel — AE property panel style */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-5 rounded-xl border border-border/60 bg-[hsl(260,20%,6%)] overflow-hidden"
      >
        <div className="px-3 py-1.5 border-b border-border/30 bg-[hsl(260,15%,10%)]">
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">Effect Controls</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Duration</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[hsl(var(--xp-gold))]">{duration.toFixed(2)}s</span>
                <span className="text-[9px] font-mono text-muted-foreground/50">{Math.round(duration * 24)}f</span>
              </div>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([v]) => setDuration(v)}
              min={0.1}
              max={2}
              step={0.01}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-[8px] font-mono text-muted-foreground/40">
              <span>0.10s</span><span>0.50s</span><span>1.00s</span><span>1.50s</span><span>2.00s</span>
            </div>
          </div>

          {/* Easing */}
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 block">
              Temporal Interpolation
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EASING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEasing(opt.value)}
                  className={`rounded px-2.5 py-1 text-[10px] font-mono transition-all border ${
                    easing === opt.value
                      ? "border-[hsl(var(--xp-gold))] bg-[hsl(var(--xp-gold)/0.15)] text-[hsl(var(--xp-gold))]"
                      : "border-border/30 bg-[hsl(260,15%,12%)] text-muted-foreground hover:bg-[hsl(260,15%,16%)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delay */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Delay</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[hsl(var(--xp-gold))]">{delay.toFixed(2)}s</span>
                <span className="text-[9px] font-mono text-muted-foreground/50">{Math.round(delay * 24)}f</span>
              </div>
            </div>
            <Slider
              value={[delay]}
              onValueChange={([v]) => setDelay(v)}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Key Principles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-5"
      >
        <h2 className="text-display mb-3 text-xs font-semibold uppercase tracking-wider">Key Principles</h2>
        <div className="space-y-1.5">
          {lesson.keyPrinciples.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
            >
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[hsl(var(--xp-gold))]" />
              <p className="text-[11px] leading-relaxed text-foreground/80">{p}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-5 rounded-xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.05)] p-4"
      >
        <p className="text-[10px] font-mono text-[hsl(var(--success))] uppercase tracking-wider mb-1">Pro Tip</p>
        <p className="text-xs leading-relaxed text-foreground/70">{lesson.tip}</p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Button
          onClick={() => navigate(`/practice/${lesson.id}`)}
          className="w-full rounded-xl bg-primary py-6 text-sm font-semibold text-primary-foreground"
        >
          ▶ Practice Challenge
        </Button>
      </motion.div>
    </div>
  );
};

export default LessonDetailPage;
