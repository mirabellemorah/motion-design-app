import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, ChevronRight, Film, Palette, Sparkles, Flame, MapPin, Briefcase, ArrowUpRight, Zap } from "lucide-react";
import { lessons } from "@/data/lessons";
import { useUserProgress } from "@/hooks/useUserProgress";

const HomePage = () => {
  const navigate = useNavigate();
  const { state, level } = useUserProgress();
  const completedCount = Object.keys(state.completed).length;

  const motionLessons = lessons.filter(l => l.track === "motion-design");
  const principlesLessons = lessons.filter(l => l.track === "principles");
  const careerLessons = lessons.filter(l => l.track === "career");
  const tracks = [
    { id: "motion-design", Icon: Film, title: "Principles of Motion Design", desc: "Foundations · 12 Principles · Easing", lessons: motionLessons, accent: "bg-primary/15 text-primary" },
    { id: "principles", Icon: Palette, title: "Principles of Design", desc: "Hierarchy, color, typography", lessons: principlesLessons, accent: "bg-[hsl(var(--ae-yellow)/0.18)] text-[hsl(var(--ae-yellow))]" },
    { id: "career", Icon: Briefcase, title: "Career Foundations", desc: "Portfolios, pricing, communication", lessons: careerLessons, accent: "bg-[hsl(var(--ae-green)/0.15)] text-[hsl(var(--ae-green))]" },
  ];

  const opportunities = [
    { role: "Motion Designer", company: "Linear", location: "Remote · Worldwide", tag: "Full-time", accent: "bg-primary/10 text-primary" },
    { role: "Brand Animator", company: "Stripe", location: "San Francisco · Hybrid", tag: "Freelance", accent: "bg-[hsl(var(--ae-orange)/0.15)] text-[hsl(var(--ae-orange))]" },
    { role: "Junior Motion Artist", company: "Notion", location: "Remote · EU", tag: "Contract", accent: "bg-[hsl(var(--ae-yellow)/0.18)] text-[hsl(var(--ae-yellow))]" },
    { role: "Senior UI Animator", company: "Figma", location: "Remote · US", tag: "Full-time", accent: "bg-[hsl(var(--ae-green)/0.15)] text-[hsl(var(--ae-green))]" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="text-sm text-muted-foreground">Good morning</p>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Design like a pro</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[hsl(var(--ae-orange)/0.12)] text-[hsl(var(--ae-orange))] px-2.5 py-1">
          <Flame className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{state.streak}</span>
        </div>
      </motion.div>

      {/* Current progress card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl p-4 mb-5 text-primary-foreground"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(265 55% 60%) 100%)",
        }}
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-10 h-16 w-16 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-90">Current Progress</span>
            <button onClick={() => navigate("/lessons")} className="text-[11px] font-medium opacity-90 hover:opacity-100">Resume →</button>
          </div>
          <p className="text-base font-semibold mb-0.5">
            {state.lastLessonId ? lessons.find(l => l.id === state.lastLessonId)?.title ?? "Start learning" : "Start learning"}
          </p>
          <p className="text-xs opacity-90 mb-3">
            {completedCount} of {lessons.length} lessons · Lvl {level} · {state.xp} XP
          </p>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
          </div>
        </div>
      </motion.div>

      {/* New Opportunities feed */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">New Opportunities</h2>
            <span className="text-[10px] font-semibold bg-[hsl(var(--ae-green)/0.15)] text-[hsl(var(--ae-green))] px-1.5 py-0.5 rounded-full">
              {opportunities.length} fresh
            </span>
          </div>
          <button onClick={() => navigate("/earn")} className="text-[11px] font-medium text-primary">See all</button>
        </div>
        <div className="space-y-2">
          {opportunities.slice(0, 3).map((o, i) => (
            <motion.button
              key={o.role}
              onClick={() => navigate("/earn")}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.04 }}
              className="w-full soft-card px-3.5 py-3 text-left hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${o.accent}`}>
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">{o.role}</p>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${o.accent}`}>
                    {o.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{o.company}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-2.5 w-2.5 text-muted-foreground/60" />
                  <p className="text-[10px] text-muted-foreground/80 truncate">{o.location}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
            </motion.button>
          ))}
        </div>
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
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tr.accent}`}>
                    <tr.Icon className="h-5 w-5" />
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
