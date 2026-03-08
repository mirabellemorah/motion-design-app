import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [demoBezier, setDemoBezier] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);

  const chapters = [
    { num: 1, title: "Foundations", desc: "Understand graphs", lessons: lessons.filter(l => l.chapter === 1) },
    { num: 2, title: "Core Curves", desc: "Ease in, out, in-out", lessons: lessons.filter(l => l.chapter === 2) },
    { num: 3, title: "Advanced", desc: "Overshoot & custom", lessons: lessons.filter(l => l.chapter === 3) },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--ae-yellow))" }} />
          <span className="ae-mono text-[10px] text-muted-foreground">GRAPH EDITOR ACADEMY</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Master Bezier Curves</h1>
        <p className="text-xs text-muted-foreground mt-1">The skill that separates amateur from professional motion.</p>
      </motion.div>

      {/* Interactive demo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <InteractiveBezierGraph
          bezier={demoBezier}
          onChange={setDemoBezier}
          width={320}
          height={200}
          label="Playground — Drag the handles"
          showSpeed={false}
        />
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-2 mb-6"
      >
        <button
          onClick={() => navigate("/lessons")}
          className="ae-panel p-3 text-left hover:bg-accent/50 transition-colors"
        >
          <BookOpen className="h-4 w-4 text-primary mb-2" />
          <p className="text-xs font-medium">Lessons</p>
          <p className="text-[10px] text-muted-foreground">{lessons.length} chapters</p>
        </button>
        <button
          onClick={() => navigate("/practice")}
          className="ae-panel p-3 text-left hover:bg-accent/50 transition-colors"
        >
          <Target className="h-4 w-4 mb-2" style={{ color: "hsl(var(--ae-green))" }} />
          <p className="text-xs font-medium">Practice</p>
          <p className="text-[10px] text-muted-foreground">Match curves</p>
        </button>
      </motion.div>

      {/* Curriculum */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="ae-label mb-3">Curriculum</h2>
        <div className="space-y-3">
          {chapters.map((ch, ci) => (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + ci * 0.05 }}
              className="ae-panel"
            >
              <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="ae-mono text-[11px] font-semibold text-primary">CH.{ch.num}</div>
                  <div>
                    <p className="text-xs font-medium">{ch.title}</p>
                    <p className="text-[10px] text-muted-foreground">{ch.desc}</p>
                  </div>
                </div>
                <span className="ae-mono text-[10px] text-muted-foreground">{ch.lessons.length}</span>
              </div>
              <div className="border-t border-border">
                {ch.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="flex-1 text-[11px]">{lesson.title}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
