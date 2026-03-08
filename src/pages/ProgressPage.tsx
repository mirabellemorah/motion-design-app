import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "@/data/lessons";

const ProgressPage = () => {
  const navigate = useNavigate();
  const completedCount = 0;
  const percentage = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-display text-xl font-bold">Your Progress</h1>
      </motion.div>

      {/* Big Progress Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percentage / 100) }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </svg>
          <span className="text-display text-4xl font-bold">{percentage}%</span>
        </div>
        <p className="mt-3 text-sm font-medium">Overall Progress</p>
        <p className="text-xs text-muted-foreground">
          {completedCount} of {lessons.length} lessons completed
        </p>
      </motion.div>

      {/* Lessons List */}
      <div>
        <h2 className="text-display mb-4 text-sm font-semibold">Lessons</h2>
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              className="flex w-full items-center gap-3 rounded-xl glass-card p-3 text-left transition-all active:scale-[0.98]"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                lesson.color === "lavender" ? "gradient-lavender" : "gradient-sage"
              }`}>
                <lesson.icon className="h-4 w-4 text-foreground/60" />
              </div>
              <span className="flex-1 text-sm font-medium">{lesson.title}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
