import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Palette,
  Compass,
  Crosshair,
  Wand2,
  Briefcase,
  Eye,
  LayoutGrid,
  Type,
  PlayCircle,
  CheckCircle2,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Library,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { lessons, todayChallenge, secondsUntilTomorrow, type LessonTrack } from "@/data/lessons";
import { RESOURCES, type Resource } from "@/data/resources";
import { useUserProgress } from "@/hooks/useUserProgress";

const TRACKS: {
  id: LessonTrack;
  label: string;
  Icon: LucideIcon;
  tagline: string;
  chapters: { num: number; title: string; Icon: LucideIcon }[];
}[] = [
  {
    id: "motion-design",
    label: "Principles of Motion Design",
    Icon: Film,
    tagline: "Foundations · 12 Principles · Timing & Easing",
    chapters: [
      { num: 1, title: "Foundations of Motion", Icon: Compass },
      { num: 2, title: "The 12 Principles of Animation", Icon: PlayCircle },
      { num: 3, title: "Timing, Easing & Cubic Bezier", Icon: Crosshair },
    ],
  },
  {
    id: "principles",
    label: "Principles of Design",
    Icon: Palette,
    tagline: "Visual fundamentals every designer needs",
    chapters: [
      { num: 1, title: "Visual Foundations", Icon: Eye },
      { num: 2, title: "Structure & Unity", Icon: LayoutGrid },
      { num: 3, title: "Color & Type", Icon: Type },
    ],
  },
  {
    id: "career",
    label: "Career Foundations",
    Icon: Briefcase,
    tagline: "The skills design school skipped",
    chapters: [
      { num: 1, title: "Selling Your Work", Icon: Sparkles },
      { num: 2, title: "Process & Craft", Icon: Wand2 },
      { num: 3, title: "Specializations", Icon: TrendingUp },
    ],
  },
];

/* ---------- Daily Challenge hero ---------- */
const DailyChallengeCard = () => {
  const navigate = useNavigate();
  const challenge = useMemo(() => todayChallenge(), []);
  const { dailyDone, completeDailyChallenge } = useUserProgress();
  const [secs, setSecs] = useState(secondsUntilTomorrow());
  useEffect(() => {
    const t = setInterval(() => setSecs(secondsUntilTomorrow()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-5 mb-5 text-primary-foreground"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(265 60% 55%) 100%)" }}
    >
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold opacity-90 inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Daily Challenge
          </span>
          <span className="text-[10px] font-mono opacity-80">
            {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </span>
        </div>
        <p className="text-lg font-semibold mb-1 leading-tight">{challenge.title}</p>
        <p className="text-xs opacity-90 mb-3 leading-relaxed">{challenge.prompt}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
            {challenge.difficulty}
          </span>
          <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" /> {challenge.minutes} min
          </span>
          <span className="text-[10px] font-semibold bg-[hsl(var(--ae-yellow))] text-foreground px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Flame className="h-2.5 w-2.5" /> +50 XP
          </span>
        </div>
        {dailyDone ? (
          <div className="w-full rounded-2xl bg-white/20 py-3 text-sm font-semibold text-center inline-flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Completed today
          </div>
        ) : (
          <button
            onClick={() => {
              completeDailyChallenge();
              navigate("/practice");
            }}
            className="w-full rounded-2xl bg-white text-primary py-3 text-sm font-semibold hover:bg-white/95 transition-colors"
          >
            Start Challenge →
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* ---------- Resources sub-tab ---------- */
const CATEGORY_COLOR: Record<Resource["category"], string> = {
  Tutorial: "bg-primary/15 text-primary",
  Article: "bg-[hsl(var(--ae-yellow)/0.2)] text-[hsl(45_70%_35%)]",
  Tool: "bg-[hsl(var(--ae-green)/0.18)] text-[hsl(var(--ae-green))]",
  Inspiration: "bg-[hsl(var(--ae-orange)/0.18)] text-[hsl(var(--ae-orange))]",
  YouTube: "bg-destructive/10 text-destructive",
};

const ResourcesView = () => {
  const [cat, setCat] = useState<Resource["category"] | "All">("All");
  const cats: (Resource["category"] | "All")[] = ["All", "Tutorial", "Article", "Tool", "Inspiration", "YouTube"];
  const filtered = cat === "All" ? RESOURCES : RESOURCES.filter((r) => r.category === cat);
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
              cat === c
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((r, i) => (
          <motion.a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="block soft-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Library className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">{r.source}</p>
                <p className="text-xs text-foreground/70 leading-relaxed mb-2">{r.blurb}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[r.category]}`}>
                  {r.category}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

/* ---------- Main page ---------- */
const LessonsPage = () => {
  const navigate = useNavigate();
  const { state, isCompleted } = useUserProgress();
  const [tab, setTab] = useState<"lessons" | "resources">("lessons");
  const [track, setTrack] = useState<LessonTrack>((state.lastTrack as LessonTrack) || "motion-design");
  const active = TRACKS.find((t) => t.id === track)!;
  const trackLessons = lessons.filter((l) => l.track === track);

  // Scroll to last lesson on mount.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.lastLessonId) {
      const el = document.getElementById(`lesson-row-${state.lastLessonId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
      }
    }
  }, [state.lastLessonId, track]);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Learn</h1>
          <p className="text-xs text-muted-foreground">
            {Object.keys(state.completed).length} / {lessons.length} lessons · {state.xp} XP
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[hsl(var(--ae-orange)/0.12)] text-[hsl(var(--ae-orange))] px-2.5 py-1">
          <Flame className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{state.streak}</span>
        </div>
      </motion.div>

      <DailyChallengeCard />

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-full mb-5">
        {(["lessons", "resources"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold capitalize transition-colors inline-flex items-center justify-center gap-1.5 ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "lessons" ? <BookOpen className="h-3.5 w-3.5" /> : <Library className="h-3.5 w-3.5" />}
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "resources" ? (
          <motion.div key="resources" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ResourcesView />
          </motion.div>
        ) : (
          <motion.div key="lessons" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Track switcher */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {TRACKS.map((t) => {
                const isActive = track === t.id;
                const count = lessons.filter((l) => l.track === t.id).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id)}
                    className={`flex-shrink-0 min-w-[200px] text-left px-3 py-2.5 rounded-2xl border transition-all ${
                      isActive ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <t.Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                        {t.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{count} lessons · {t.tagline}</p>
                  </button>
                );
              })}
            </div>

            <div ref={scrollRef} className="space-y-4">
              {active.chapters.map((ch) => {
                const chLessons = trackLessons.filter((l) => l.chapter === ch.num);
                if (chLessons.length === 0) return null;
                return (
                  <div key={ch.num}>
                    <div className="flex items-center gap-2 mb-2">
                      <ch.Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="ae-label">Chapter {ch.num} — {ch.title}</span>
                    </div>

                    <div className="soft-card overflow-hidden">
                      {chLessons.map((lesson, i) => {
                        const done = isCompleted(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            id={`lesson-row-${lesson.id}`}
                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                          >
                            <div className="flex-shrink-0">
                              {done ? (
                                <div className="h-7 w-7 rounded-full bg-[hsl(var(--success))] flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success-foreground))]" />
                                </div>
                              ) : (
                                <div className="h-7 w-7 rounded-full border-2 border-border flex items-center justify-center">
                                  <span className="text-[10px] font-medium text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`text-sm font-medium truncate ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                  {lesson.title}
                                </p>
                                {lesson.stub && (
                                  <span className="text-[9px] font-semibold bg-[hsl(var(--ae-yellow)/0.2)] text-[hsl(45_70%_35%)] px-1.5 py-0.5 rounded-full">
                                    SOON
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{lesson.subtitle}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonsPage;
