import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { lessons, COMMON_PRESETS } from "@/data/lessons";
import InteractiveBezierGraph from "@/components/InteractiveBezierGraph";
import { useState } from "react";

const ProgressPage = () => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState(0);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Home
      </motion.button>

      {/* Bold header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-tile bento-lime p-6 mb-4"
      >
        <span className="sticker sticker-ink mb-3 inline-block">Reference</span>
        <h1 className="text-display-xl text-3xl text-ink mb-1">CURVE LIBRARY</h1>
        <p className="text-ink/60 text-xs font-bold uppercase tracking-widest">Study common easing presets</p>
      </motion.div>

      {/* Curve library */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <span className="sticker sticker-ink mb-2 inline-block">Preset Library</span>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {COMMON_PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setSelectedPreset(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
                selectedPreset === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Dark AE panel for graph */}
        <InteractiveBezierGraph
          bezier={COMMON_PRESETS[selectedPreset].bezier}
          width={320}
          height={240}
          interactive={false}
          label={`${COMMON_PRESETS[selectedPreset].label} — cubic-bezier(${COMMON_PRESETS[selectedPreset].bezier.join(", ")})`}
          color="var(--ae-yellow)"
        />
      </motion.div>

      {/* Lesson index */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <span className="sticker sticker-ink mb-2 inline-block">All Lessons</span>
        <div className="bento-tile bento-cream border-2 border-border overflow-hidden p-0">
          {lessons.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
            >
              <span className="text-xs font-black text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">{lesson.title}</p>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">CH.{lesson.chapter}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
