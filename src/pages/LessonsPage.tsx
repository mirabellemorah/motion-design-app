import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";

const LessonsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-2 flex items-center gap-3"
      >
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-display text-xl font-bold">Motion Principles</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-xs leading-relaxed text-muted-foreground"
      >
        Master these {lessons.length} fundamental principles to create amazing animations. Each lesson
        includes theory and hands-on practice.
      </motion.p>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => navigate(`/lesson/${lesson.id}`)}
            className="flex w-full items-center gap-4 rounded-2xl glass-card p-4 text-left transition-all active:scale-[0.98]"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                lesson.color === "lavender" ? "gradient-lavender" : "gradient-sage"
              }`}
            >
              <lesson.icon className="h-5 w-5 text-foreground/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{lesson.title}</p>
              <p className="text-xs text-muted-foreground truncate">{lesson.subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
