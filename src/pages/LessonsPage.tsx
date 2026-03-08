import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";

const LessonsPage = () => {
  const navigate = useNavigate();

  const chapters = [
    { num: 1, title: "Foundations", color: "var(--ae-yellow)" },
    { num: 2, title: "Core Curves", color: "var(--ae-green)" },
    { num: 3, title: "Advanced Techniques", color: "var(--ae-blue)" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Graph Editor Lessons</h1>
          <p className="text-[11px] text-muted-foreground">{lessons.length} lessons across 3 chapters</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {chapters.map((ch, ci) => {
          const chLessons = lessons.filter(l => l.chapter === ch.num);
          return (
            <motion.div
              key={ch.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + ci * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full" style={{ background: `hsl(${ch.color})` }} />
                <span className="ae-label">Chapter {ch.num} — {ch.title}</span>
              </div>

              <div className="ae-panel">
                {chLessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span className="ae-mono text-[10px] text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium">{lesson.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{lesson.subtitle}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsPage;
