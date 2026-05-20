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
    label: "Motion Design",
    Icon: Film,
    tagline: "Foundations · 12 Principles · Easing",
    chapters: [
      { num: 1, title: "Foundations of Motion", Icon: Compass },
      { num: 2, title: "The 12 Principles of Animation", Icon: PlayCircle },
      { num: 3, title: "Timing, Easing & Cubic Bezier", Icon: Crosshair },
    ],
  },
  {
    id: "principles",
    label: "Design Principles",
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
    label: "Career",
    Icon: Briefcase,
    tagline: "The skills design school skipped",
    chapters: [
      { num: 1, title: "Selling Your Work", Icon: Sparkles },
      { num: 2, title: "Process & Craft", Icon: Wand2 },
      { num: 3, title: "Specializations", Icon: TrendingUp },
    ],
  },
];

/* ---------- Daily Challenge — bold violet cover ---------- */
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
      className="bento-tile bento-violet p-6 mb-5 group"
    >
      <div className="relative z-10 flex items-center justify-between mb-4">
        <span className="sticker sticker-lime inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Daily Challenge
        </span>
        <span className="text-[10px] font-mono opacity-80">
          {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </span>
      </div>
      <h2 className="relative z-10 text-display-xl text-3xl lg:text-4xl mb-2 max-w-[80%]">
        {challenge.title.toUpperCase()}
      </h2>
      <p className="relative z-10 text-xs opacity-90 mb-4 leading-relaxed max-w-md">
        {challenge.prompt}
      </p>
      <div className="relative z-10 flex flex-wrap items-center gap-2 mb-5">
        <span className="sticker bg-white/20 text-white">{challenge.difficulty}</span>
        <span className="sticker bg-white/20 text-white inline-flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" /> {challenge.minutes} min
        </span>
        <span className="sticker sticker-lime inline-flex items-center gap-1">
          <Flame className="h-2.5 w-2.5" /> +50 XP
        </span>
      </div>
      {dailyDone ? (
        <div className="relative z-10 w-full rounded-2xl bg-white/20 py-3.5 text-sm font-extrabold text-center inline-flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Completed today
        </div>
      ) : (
        <button
          onClick={() => {
            completeDailyChallenge();
            navigate("/practice");
          }}
          className="relative z-10 w-full rounded-2xl bg-lime text-lime-foreground py-3.5 text-sm font-black uppercase tracking-tight hover:bg-white transition-colors"
        >
          Start Challenge →
        </button>
      )}
      {/* Decorative sticker */}
      <div className="absolute -right-4 -top-4 bg-lime text-lime-foreground w-20 h-20 rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-lg z-0">
        <span className="font-black text-center text-[10px] leading-tight">
          NEW<br />TODAY
        </span>
      </div>
    </motion.div>
  );
};

/* ---------- Resources sub-tab ---------- */
const CATEGORY_STYLE: Record<Resource["category"], string> = {
  Tutorial: "sticker-violet",
  Article: "sticker-lime",
  Tool: "sticker-ink",
  Inspiration: "bg-[hsl(var(--ae-orange))] text-white",
  YouTube: "bg-destructive text-destructive-foreground",
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
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider border-2 transition-all ${
              cat === c
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border bg-card text-muted-foreground hover:border-ink"
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
            className="block bento-tile bento-cream border-2 border-border p-4 hover:border-ink transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Library className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate mb-0.5">{r.title}</p>
                <p className="text-[11px] text-muted-foreground mb-2">{r.source}</p>
                <p className="text-xs text-foreground/70 leading-relaxed mb-2">{r.blurb}</p>
                <span className={`sticker ${CATEGORY_STYLE[r.category]}`}>{r.category}</span>
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
    <div className="min-h-screen bg-background px-4 pb-24 pt-6 lg:px-8 lg:pt-10">
      {/* Bold header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div className="flex items-end gap-2 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors mb-2 lg:hidden"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
              {Object.keys(state.completed).length} / {lessons.length} done · {state.xp} XP
            </p>
            <h1 className="text-display-xl text-3xl lg:text-5xl text-foreground">
              LEARN<span className="text-primary">.</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ink text-ink-foreground px-3 py-1.5 shrink-0">
          <Flame className="h-3.5 w-3.5 text-lime" />
          <span className="text-xs font-extrabold">{state.streak}</span>
        </div>
      </motion.div>

      <DailyChallengeCard />

      {/* Sub-tabs — chunky pill */}
      <div className="flex gap-1 p-1 bg-ink rounded-full mb-5 w-fit">
        {(["lessons", "resources"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 ${
              tab === t ? "bg-lime text-lime-foreground" : "text-white/60 hover:text-white"
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
            {/* Track switcher — bold cover tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {TRACKS.map((t, idx) => {
                const isActive = track === t.id;
                const count = lessons.filter((l) => l.track === t.id).length;
                const activeStyle =
                  idx === 0 ? "bento-violet" : idx === 1 ? "bento-lime" : "bento-ink";
                const styles = isActive
                  ? activeStyle
                  : "bento-cream border-2 border-border hover:border-ink";
                const muted = isActive
                  ? idx === 1
                    ? "text-ink/70"
                    : "text-white/70"
                  : "text-muted-foreground";
                const iconBg = isActive
                  ? idx === 1
                    ? "bg-ink text-lime"
                    : "bg-white/15 text-current"
                  : "bg-primary/15 text-primary";
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id)}
                    className={`bento-tile text-left p-4 transition-all ${styles}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                        <t.Icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      <span className={`font-black text-lg ${muted}`}>{count}</span>
                    </div>
                    <p className="text-sm font-black leading-tight tracking-tight uppercase mb-1">
                      {t.label}
                    </p>
                    <p className={`text-[10px] ${muted}`}>{t.tagline}</p>
                  </button>
                );
              })}
            </div>

            <div ref={scrollRef} className="space-y-5">
              {active.chapters.map((ch) => {
                const chLessons = trackLessons.filter((l) => l.chapter === ch.num);
                if (chLessons.length === 0) return null;
                return (
                  <div key={ch.num}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="sticker sticker-ink">CH {String(ch.num).padStart(2, "0")}</span>
                      <h3 className="text-base font-black tracking-tight uppercase text-foreground">
                        {ch.title}
                      </h3>
                    </div>

                    <div className="bento-tile bento-cream border-2 border-border overflow-hidden">
                      {chLessons.map((lesson, i) => {
                        const done = isCompleted(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            id={`lesson-row-${lesson.id}`}
                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/60 transition-colors border-b border-border/60 last:border-0"
                          >
                            <div className="flex-shrink-0">
                              {done ? (
                                <div className="h-8 w-8 rounded-full bg-lime flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-lime-foreground" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full border-2 border-ink/20 flex items-center justify-center">
                                  <span className="text-[10px] font-black text-foreground">{String(i + 1).padStart(2, "0")}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`text-sm font-bold truncate ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                  {lesson.title}
                                </p>
                                {lesson.stub && (
                                  <span className="sticker sticker-lime text-[9px] px-1.5 py-0.5">SOON</span>
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
