import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, CheckCircle2, Lock, Construction } from "lucide-react";
import { lessons, COMMON_PRESETS } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import SpeedGraph from "@/components/SpeedGraph";
import AnimationPreview from "@/components/AnimationPreview";
import DualGraphComparison from "@/components/DualGraphComparison";
import BezierTheoryExplainer from "@/components/BezierTheoryExplainer";
import PrincipleDemo from "@/components/PrincipleDemos";
import AnimationPrincipleDemo from "@/components/AnimationPrincipleDemos";
import CubicBezierLab from "@/components/CubicBezierLab";
import QuizCard from "@/components/QuizCard";
import CurveZoomModal from "@/components/CurveZoomModal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useUserProgress } from "@/hooks/useUserProgress";

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === id);
  const lessonIndex = lessons.findIndex((l) => l.id === id);
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  const { isCompleted, completeLesson, setLastLesson } = useUserProgress();

  const [bezier, setBezier] = useState<[number, number, number, number]>(
    lesson?.defaultBezier || [0, 0, 1, 1]
  );
  const [duration, setDuration] = useState(0.6);
  const [showTheory, setShowTheory] = useState(true);
  const [showDual, setShowDual] = useState(true);
  const [showExplainer, setShowExplainer] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Persist last lesson visited.
  useEffect(() => {
    if (lesson) setLastLesson(lesson.id, lesson.track);
  }, [lesson, setLastLesson]);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  const isMotionFoundations = lesson.track === "motion-design" && lesson.chapter === 1;
  const isTimingEasing = lesson.track === "motion-design" && lesson.chapter === 3 && !lesson.cubicBezierLab;
  const isMotionGraph = isMotionFoundations || isTimingEasing;
  const isPrinciples = lesson.track === "principles";
  const isAnimPrinciples = lesson.track === "motion-design" && lesson.chapter === 2;
  const isStub = lesson.stub === true;

  const done = isCompleted(lesson.id);

  const markDone = () => {
    completeLesson(lesson.id, 25);
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate("/lessons")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-primary uppercase tracking-wider">CH.{lesson.chapter}</span>
            <h1 className="text-base font-semibold truncate text-foreground">{lesson.title}</h1>
            {done && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] flex-shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground">{lesson.subtitle}</p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-4 text-xs leading-relaxed text-muted-foreground">
        {lesson.description}
      </motion.p>

      {/* Stub banner */}
      {isStub && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 soft-card p-4 border-l-4 border-l-[hsl(var(--ae-yellow))]">
          <p className="text-[10px] font-semibold mb-1 text-[hsl(45_70%_35%)] uppercase tracking-wider inline-flex items-center gap-1">
            <Construction className="h-3 w-3" /> Coming Soon
          </p>
          <p className="text-xs leading-relaxed text-foreground/80">
            This module is in development. Tap <strong>Mark interested</strong> to be notified when the full lesson — with examples, templates, and exercises — goes live.
          </p>
        </motion.div>
      )}

      {/* Theory toggle */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
        <button onClick={() => setShowTheory(!showTheory)} className="ae-label flex items-center gap-1 mb-2">
          <span>{showTheory ? "▾" : "▸"}</span>
          <span>Theory</span>
        </button>
        {showTheory && (
          <div className="soft-card p-4 space-y-2">
            {lesson.theory.map((t, i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-xs leading-relaxed text-foreground/80">{t}</p>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                <span className="text-primary font-medium">{isMotionGraph || lesson.cubicBezierLab ? "AE" : "In Practice"}:</span> {lesson.aeContext}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* CUBIC BEZIER LAB */}
      {lesson.cubicBezierLab && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <p className="ae-label mb-2">Lab</p>
          <CubicBezierLab />
        </motion.div>
      )}

      {/* MOTION GRAPH LESSONS: graphs + curve playground */}
      {isMotionGraph && !lesson.cubicBezierLab && (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
            <InteractiveBezierGraph
              bezier={bezier}
              onChange={setBezier}
              width={320}
              height={240}
              label="Value Graph — Drag to explore"
              color="var(--ae-yellow)"
              snapToGrid={false}
              onZoom={() => setZoomOpen(true)}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-4">
            <SpeedGraph bezier={bezier} width={320} height={160} color="var(--ae-green)" label="Speed Graph — Velocity over time" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
            <AnimationPreview bezier={bezier} duration={duration} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-4">
            <button onClick={() => setShowDual(!showDual)} className="ae-label flex items-center gap-1 mb-2">
              <span>{showDual ? "▾" : "▸"}</span>
              <span>Value vs Speed — Side by Side</span>
            </button>
            {showDual && <DualGraphComparison bezier={bezier} width={320} />}
          </motion.div>
        </>
      )}

      {/* PRINCIPLES TRACK: interactive design demos */}
      {isPrinciples && lesson.demo && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <p className="ae-label mb-2">Try It</p>
          <PrincipleDemo demo={lesson.demo} />
        </motion.div>
      )}

      {/* 12 ANIMATION PRINCIPLES: interactive scene demos */}
      {isAnimPrinciples && lesson.animDemo && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <p className="ae-label mb-2">See It in Action</p>
          <AnimationPrincipleDemo demo={lesson.animDemo} />
        </motion.div>
      )}

      {/* Creative practice */}
      {lesson.creativePractice && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 soft-card p-4 border-l-4 border-l-[hsl(var(--ae-orange))]">
          <p className="text-[10px] font-semibold mb-1.5 text-[hsl(var(--ae-orange))] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Creative Practice
          </p>
          <p className="text-xs leading-relaxed text-foreground/80">{lesson.creativePractice}</p>
        </motion.div>
      )}

      {/* Quiz with retry — auto-completes lesson when correct */}
      {lesson.quiz && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-4">
          <QuizCard
            quiz={lesson.quiz}
            onCorrect={() => {
              if (!done) markDone();
            }}
          />
        </motion.div>
      )}

      {/* Controls — only motion-graph lessons */}
      {isMotionGraph && !lesson.cubicBezierLab && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-4 soft-card">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="ae-label">Controls</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="ae-label">Duration</span>
                <span className="text-xs font-medium text-primary">{duration.toFixed(2)}s</span>
              </div>
              <Slider value={[duration]} onValueChange={([v]) => setDuration(v)} min={0.1} max={2} step={0.05} />
            </div>
            <div>
              <span className="ae-label block mb-2">Presets</span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_PRESETS.map((p) => {
                  const isActive = p.bezier.every((v, i) => Math.abs(v - bezier[i]) < 0.01);
                  return (
                    <button
                      key={p.label}
                      onClick={() => setBezier([...p.bezier])}
                      className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium border transition-all ${
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
      )}

      {/* Key Takeaways */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
        <span className="ae-label block mb-2">Key Takeaways</span>
        <div className="space-y-2">
          {lesson.keyPrinciples.map((p, i) => (
            <div key={i} className="flex items-start gap-3 soft-card px-4 py-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/80">{p}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-4 soft-card p-4 border-l-4 border-l-primary">
        <p className="text-[10px] font-semibold mb-1 text-primary uppercase tracking-wider">PRO TIP</p>
        <p className="text-xs leading-relaxed text-foreground/70">{lesson.tip}</p>
      </motion.div>

      {/* Beginner Explainer — motion-graph lessons */}
      {isMotionGraph && !lesson.cubicBezierLab && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="mb-5">
          <button onClick={() => setShowExplainer(!showExplainer)} className="ae-label flex items-center gap-1.5 mb-2">
            <span>{showExplainer ? "▾" : "▸"}</span>
            <BookOpen className="h-3 w-3" />
            <span>Complete Beginner's Guide to Bezier Curves</span>
          </button>
          {showExplainer && <BezierTheoryExplainer />}
        </motion.div>
      )}

      {/* Navigation + complete CTA */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
        {isMotionGraph && !lesson.cubicBezierLab && (
          <Button onClick={() => navigate(`/practice/${lesson.id}`)} className="w-full rounded-2xl py-5 text-sm font-semibold bg-primary hover:bg-primary/90">
            Practice This Curve →
          </Button>
        )}
        {isStub ? (
          <button
            onClick={markDone}
            disabled={done}
            className="w-full rounded-2xl py-3.5 text-sm font-semibold border border-border bg-card text-foreground hover:bg-accent disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {done ? <><CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" /> Saved as interested</> : <><Lock className="h-4 w-4" /> Mark interested</>}
          </button>
        ) : !done && !lesson.quiz ? (
          <Button onClick={markDone} className="w-full rounded-2xl py-5 text-sm font-semibold bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))]">
            <CheckCircle2 className="h-4 w-4" /> Mark Lesson Complete · +25 XP
          </Button>
        ) : null}
        {nextLesson && (
          <button
            onClick={() => navigate(`/lesson/${nextLesson.id}`)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Next: {nextLesson.title} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </motion.div>

      <CurveZoomModal
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        bezier={bezier}
        onChange={setBezier}
        label={`${lesson.title} — Fullscreen`}
      />
    </div>
  );
};

export default LessonDetailPage;
