import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Star, Gem, BookOpen, BarChart3, Lightbulb } from "lucide-react";
import { lessons, initialStats } from "@/data/lessons";

const HomePage = () => {
  const navigate = useNavigate();
  const stats = initialStats;

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-display text-2xl font-bold">Motion Design Academy</h1>
        <p className="text-sm text-muted-foreground">Master the art of animation</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex justify-around rounded-2xl glass-card p-4"
      >
        {[
          { icon: Star, label: "POINTS", value: stats.xp, color: "text-xp-gold" },
          { icon: Flame, label: "STREAK", value: stats.streak, color: "text-destructive" },
          { icon: Gem, label: "GEMS", value: stats.gems, color: "text-primary" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-lg font-bold">{stat.value}</span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-display text-sm font-semibold">Your Progress</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            0/{lessons.length}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "0%" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Start your journey in motion design!
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 space-y-3"
      >
        {[
          { icon: BookOpen, label: "Browse Lessons", sub: "Learn all 12 principles", path: "/lessons" },
          { icon: BarChart3, label: "View Progress", sub: "See your achievements", path: "/progress" },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="flex w-full items-center gap-4 rounded-2xl glass-card p-4 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-lavender">
              <action.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.sub}</p>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>
        ))}
      </motion.div>

      {/* Tip of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl gradient-sage p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-accent-foreground" />
          <h3 className="text-sm font-semibold">Tip of the Day</h3>
        </div>
        <p className="text-xs leading-relaxed text-foreground/70">
          Most UI animations should be between 200-400ms. Any longer feels sluggish, any shorter feels jarring.
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
