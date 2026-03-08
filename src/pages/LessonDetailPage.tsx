import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons, COMMON_PRESETS } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import AnimationPreview from "@/components/AnimationPreview";
import DualGraphComparison from "@/components/DualGraphComparison";
import BezierTheoryExplainer from "@/components/BezierTheoryExplainer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === id);
  const lessonIndex = lessons.findIndex((l) => l.id === id);
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  const [bezier, setBezier] = useState<[number, number, number, number]>(
    lesson?.defaultBezier || [0, 0, 1, 1]
  );
  const [duration, setDuration] = useState(0.6);
  const [showTheory, setShowTheory] = useState(true);
  const [showDual, setShowDual] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate("/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="ae-mono text-[10px] text-primary">CH.{lesson.chapter}</span>
            <h1 className="text-base font-semibold truncate">{lesson.title}</h1>
          </div>
          <p className="text-[11px] text-muted-foreground">{lesson.subtitle}</p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-4 text-[12px] leading-relaxed text-muted-foreground">
        {lesson.description}
      </motion.p>

      {/* Theory toggle */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
        <button onClick={() => setShowTheory(!showTheory)} className="ae-label flex items-center gap-1 mb-2">
          <span>{showTheory ? "▾" : "▸"}</span>
          <span>Theory</span>
        </button>
        {showTheory && (
          <div className="ae-panel p-3 space-y-2">
            {lesson.theory.map((t, i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                <p className="text-[11px] leading-relaxed text-foreground/80">{t}</p>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] ae-mono text-muted-foreground">
                <span className="text-primary">AE:</span> {lesson.aeContext}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Interactive Graph with snap-to-grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
        <InteractiveBezierGraph
          bezier={bezier}
          onChange={setBezier}
          width={320}
          height={240}
          label="Value Graph — Drag to explore"
          color="var(--ae-yellow)"
          snapToGrid={false}
        />
      </motion.div>

      {/* Animation Preview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
        <AnimationPreview bezier={bezier} duration={duration} />
      </motion.div>

      {/* Side-by-Side Toggle */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-4">
        <button onClick={() => setShowDual(!showDual)} className="ae-label flex items-center gap-1 mb-2">
          <span>{showDual ? "▾" : "▸"}</span>
          <span>Value vs Speed — Side by Side</span>
        </button>
        {showDual && <DualGraphComparison bezier={bezier} width={320} />}
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-4 ae-panel">
        <div className="ae-panel-header">
          <span className="ae-label">Controls</span>
        </div>
        <div className="p-3 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="ae-label">Duration</span>
              <span className="ae-mono text-[11px]" style={{ color: "hsl(var(--ae-yellow))" }}>{duration.toFixed(2)}s</span>
            </div>
            <Slider value={[duration]} onValueChange={([v]) => setDuration(v)} min={0.1} max={2} step={0.05} />
          </div>
          <div>
            <span className="ae-label block mb-1.5">Presets</span>
            <div className="flex flex-wrap gap-1">
              {COMMON_PRESETS.map((p) => {
                const isActive = p.bezier.every((v, i) => Math.abs(v - bezier[i]) < 0.01);
                return (
                  <button
                    key={p.label}
                    onClick={() => setBezier([...p.bezier])}
                    className={`rounded px-2 py-1 ae-mono text-[9px] border transition-all ${
                      isActive ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Takeaways */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
        <span className="ae-label block mb-2">Key Takeaways</span>
        <div className="space-y-1.5">
          {lesson.keyPrinciples.map((p, i) => (
            <div key={i} className="flex items-start gap-2 ae-panel px-3 py-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(var(--ae-yellow))" }} />
              <p className="text-[11px] leading-relaxed text-foreground/80">{p}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-4 ae-panel p-3 border-l-2" style={{ borderLeftColor: "hsl(var(--ae-green))" }}>
        <p className="ae-mono text-[10px] mb-1" style={{ color: "hsl(var(--ae-green))" }}>PRO TIP</p>
        <p className="text-[11px] leading-relaxed text-foreground/70">{lesson.tip}</p>
      </motion.div>

      {/* Beginner Explainer Toggle */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="mb-5">
        <button onClick={() => setShowExplainer(!showExplainer)} className="ae-label flex items-center gap-1 mb-2">
          <span>{showExplainer ? "▾" : "▸"}</span>
          <span>📖 Complete Beginner's Guide to Bezier Curves</span>
        </button>
        {showExplainer && <BezierTheoryExplainer />}
      </motion.div>

      {/* Navigation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
        <Button onClick={() => navigate(`/practice/${lesson.id}`)} className="w-full rounded-lg py-5 text-sm font-medium">
          Practice This Curve →
        </Button>
        {nextLesson && (
          <button
            onClick={() => navigate(`/lesson/${nextLesson.id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Next: {nextLesson.title} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default LessonDetailPage;
