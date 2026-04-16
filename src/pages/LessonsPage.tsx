import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons, type LessonTrack } from "@/data/lessons";

const TRACKS: { id: LessonTrack; label: string; emoji: string; tagline: string; chapters: { num: number; title: string; icon: string }[] }[] = [
  {
    id: "motion",
    label: "Motion Design",
    emoji: "🎬",
    tagline: "Bezier curves & graph editor",
    chapters: [
      { num: 1, title: "Foundations", icon: "📐" },
      { num: 2, title: "Core Curves", icon: "🎯" },
      { num: 3, title: "Advanced Techniques", icon: "⚡" },
    ],
  },
  {
    id: "principles",
    label: "Principles of Design",
    emoji: "🎨",
    tagline: "The fundamentals every designer needs",
    chapters: [
      { num: 1, title: "Visual Foundations", icon: "👁️" },
      { num: 2, title: "Structure & Unity", icon: "🧩" },
      { num: 3, title: "Color & Type", icon: "🌈" },
    ],
  },
];

const LessonsPage = () => {
  const navigate = useNavigate();
  const [track, setTrack] = useState<LessonTrack>("motion");
  const active = TRACKS.find(t => t.id === track)!;
  const trackLessons = lessons.filter(l => l.track === track);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Lessons</h1>
          <p className="text-xs text-muted-foreground">{lessons.length} lessons across 2 tracks</p>
        </div>
      </motion.div>

      {/* Track switcher */}
      <div className="flex gap-2 mb-5">
        {TRACKS.map((t) => {
          const isActive = track === t.id;
          const count = lessons.filter(l => l.track === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={`flex-1 text-left px-3 py-2.5 rounded-2xl border transition-all ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{t.emoji}</span>
                <span className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                  {t.label}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{count} lessons · {t.tagline}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={track}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {active.chapters.map((ch, ci) => {
            const chLessons = trackLessons.filter(l => l.chapter === ch.num);
            if (chLessons.length === 0) return null;
            return (
              <div key={ch.num}>
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
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LessonsPage;
