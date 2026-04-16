import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";

const LessonsPage = () => {
  const navigate = useNavigate();

  const chapters = [
    { num: 1, title: "Foundations", icon: "📐" },
    { num: 2, title: "Core Curves", icon: "🎯" },
    { num: 3, title: "Advanced Techniques", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Graph Editor Lessons</h1>
          <p className="text-xs text-muted-foreground">{lessons.length} lessons across 3 chapters</p>
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
                <span className="text-base">{ch.icon}</span>
                <span className="ae-label">Chapter {ch.num} — {ch.title}</span>
              </div>

              <div className="soft-card overflow-hidden">
                {chLessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span className="text-xs font-medium text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{lesson.subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
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
