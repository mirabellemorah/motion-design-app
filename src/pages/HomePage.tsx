import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [demoBezier, setDemoBezier] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1]);

  const motionLessons = lessons.filter(l => l.track === "motion");
  const principlesLessons = lessons.filter(l => l.track === "principles");
  const tracks = [
    { id: "motion", emoji: "🎬", title: "Motion Design", desc: "Bezier curves & graph editor", lessons: motionLessons, accent: "bg-primary/15 text-primary" },
    { id: "principles", emoji: "🎨", title: "Principles of Design", desc: "Hierarchy, color, typography", lessons: principlesLessons, accent: "bg-[hsl(var(--ae-yellow)/0.18)] text-[hsl(var(--ae-yellow))]" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-muted-foreground mb-0.5">Good morning ✨</p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Master Bezier Curves</h1>
      </motion.div>

      {/* Current progress card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="soft-card p-4 mb-5"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="ae-label text-primary">CURRENT PROGRESS</span>
          <button onClick={() => navigate("/progress")} className="text-xs text-primary font-medium">See all</button>
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">Learning Value Graphs</p>
        <p className="text-xs text-muted-foreground mb-3">2 of {lessons.length} lessons completed</p>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(2 / lessons.length) * 100}%` }} />
        </div>
      </motion.div>

      {/* Interactive demo — dark AE panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
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
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <button
          onClick={() => navigate("/lessons")}
          className="soft-card p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Lessons</p>
          <p className="text-xs text-muted-foreground">{lessons.length} chapters</p>
        </button>
        <button
          onClick={() => navigate("/practice")}
          className="soft-card p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Practice</p>
          <p className="text-xs text-muted-foreground">Match curves</p>
        </button>
      </motion.div>

      {/* Curriculum — both tracks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="ae-label mb-3">Curriculum</h2>
        <div className="space-y-3">
          {tracks.map((tr, ci) => (
            <motion.button
              key={tr.id}
              onClick={() => navigate("/lessons")}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + ci * 0.05 }}
              className="soft-card w-full text-left overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${tr.accent}`}>
                    {tr.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tr.title}</p>
                    <p className="text-xs text-muted-foreground">{tr.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{tr.lessons.length}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
