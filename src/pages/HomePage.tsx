import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Target,
  ArrowUpRight,
  Flame,
  Briefcase,
  ChevronRight,
  Film,
  Palette,
} from "lucide-react";
import { lessons } from "@/data/lessons";
import { useUserProgress } from "@/hooks/useUserProgress";

const HomePage = () => {
  const navigate = useNavigate();
  const { state, level } = useUserProgress();
  const completedCount = Object.keys(state.completed).length;
  const progressPct = Math.round((completedCount / lessons.length) * 100) || 0;

  const currentLesson =
    (state.lastLessonId && lessons.find((l) => l.id === state.lastLessonId)) || lessons[0];

  const opportunities = [
    { role: "Motion Designer", company: "Linear", tag: "Full-time" },
    { role: "Brand Animator", company: "Stripe", tag: "Freelance" },
    { role: "Junior Motion Artist", company: "Notion", tag: "Contract" },
  ];

  const tracks = [
    { id: "motion-design", Icon: Film, title: "Principles of Motion", desc: "Foundations · Easing", count: lessons.filter((l) => l.track === "motion-design").length },
    { id: "principles", Icon: Palette, title: "Principles of Design", desc: "Hierarchy · Color · Type", count: lessons.filter((l) => l.track === "principles").length },
    { id: "career", Icon: Briefcase, title: "Career Foundations", desc: "Portfolio · Pricing", count: lessons.filter((l) => l.track === "career").length },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-6 lg:px-8 lg:pt-10">
      {/* Top header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
            Monday morning
          </p>
          <h1 className="text-display-xl text-3xl lg:text-5xl text-foreground">
            Good morning,
            <br className="hidden sm:block" /> <span className="text-primary">designer</span>.
          </h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ink text-ink-foreground px-3 py-1.5 shrink-0">
          <Flame className="h-3.5 w-3.5 text-lime" />
          <span className="text-xs font-extrabold">{state.streak}</span>
        </div>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 auto-rows-[8rem] gap-3 lg:gap-4">
        {/* Current Progress cover — large */}
        <motion.button
          onClick={() => navigate(`/lessons/${currentLesson.id}`)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bento-tile bento-violet col-span-12 lg:col-span-8 row-span-3 p-6 lg:p-8 text-left flex flex-col justify-between hover:shadow-xl transition-shadow group"
        >
          <div className="relative z-10">
            <span className="sticker sticker-lime">In Progress</span>
            <h2 className="text-display-xl text-4xl lg:text-6xl mt-4 lg:mt-6">
              {currentLesson.title.toUpperCase()}
            </h2>
            <p className="text-sm opacity-80 mt-2 max-w-md">
              {completedCount} of {lessons.length} lessons · Lvl {level} · {state.xp} XP
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 mt-6">
            <div className="h-2.5 flex-1 max-w-xs bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-black text-lg">{progressPct}%</span>
          </div>
          {/* Sticker */}
          <div className="absolute -right-4 -top-4 lg:-right-6 lg:-top-6 bg-lime text-lime-foreground w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-lg">
            <span className="font-black text-center text-xs lg:text-sm leading-tight">
              KEEP
              <br />
              GOING
            </span>
          </div>
        </motion.button>

        {/* New Opportunities — tall dark */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-tile bento-ink col-span-12 lg:col-span-4 row-span-5 p-6 lg:p-7 flex flex-col"
        >
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-lime text-xl lg:text-2xl font-black leading-tight uppercase tracking-tight">
              New
              <br />
              Opportunities
            </h3>
            <button
              onClick={() => navigate("/earn")}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-lime transition-colors"
              aria-label="See all"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {opportunities.map((o) => (
              <button
                key={o.role}
                onClick={() => navigate("/earn")}
                className="w-full bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/10 text-left"
              >
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  {o.company}
                </p>
                <p className="text-white font-bold text-sm mb-2">{o.role}</p>
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                    o.tag === "Full-time"
                      ? "bg-lime text-lime-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {o.tag}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/earn")}
            className="mt-5 w-full bg-lime text-lime-foreground py-3.5 rounded-2xl font-black uppercase tracking-tight text-sm hover:bg-white transition-colors"
          >
            View all jobs
          </button>
        </motion.div>

        {/* Lessons tile — lime */}
        <motion.button
          onClick={() => navigate("/lessons")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bento-tile bento-lime col-span-6 lg:col-span-4 row-span-2 p-5 lg:p-6 text-left flex flex-col justify-between hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="w-11 h-11 bg-ink rounded-xl flex items-center justify-center text-lime">
              <BookOpen className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-ink/40 font-black text-xl">{lessons.length}</span>
          </div>
          <h3 className="text-ink text-2xl lg:text-3xl font-black leading-none tracking-tighter">
            DAILY
            <br />
            LESSONS
          </h3>
        </motion.button>

        {/* Practice tile — outlined */}
        <motion.button
          onClick={() => navigate("/practice")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-tile bento-cream col-span-6 lg:col-span-4 row-span-2 p-5 lg:p-6 text-left flex flex-col justify-between border-2 border-primary hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Target className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-primary font-black text-xl">04</span>
          </div>
          <h3 className="text-primary text-2xl lg:text-3xl font-black leading-none tracking-tighter">
            SKILL
            <br />
            PRACTICE
          </h3>
        </motion.button>

        {/* Curriculum strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bento-tile bento-cream col-span-12 lg:col-span-8 row-span-2 p-5 lg:p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base lg:text-lg font-black tracking-tight uppercase">
              Curriculum
            </h4>
            <button
              onClick={() => navigate("/lessons")}
              className="text-xs font-bold text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tracks.map((tr) => (
              <button
                key={tr.id}
                onClick={() => navigate("/lessons")}
                className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60 hover:bg-secondary transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <tr.Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-foreground truncate">
                    {tr.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{tr.desc}</p>
                </div>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <span className="text-[10px] font-bold">{tr.count}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
