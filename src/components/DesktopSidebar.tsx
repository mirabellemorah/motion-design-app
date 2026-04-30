import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Briefcase,
  Trophy,
  Users,
  User,
  Target,
  TrendingUp,
  Sparkles,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserProgress } from "@/hooks/useUserProgress";

const primary = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "Learn", path: "/lessons" },
  { icon: Target, label: "Practice", path: "/practice" },
  { icon: Briefcase, label: "Earn", path: "/earn" },
];

const secondary = [
  { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: User, label: "Profile", path: "/profile" },
];

const DesktopSidebar = () => {
  const location = useLocation();
  const { state, level } = useUserProgress();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        (path === "/lessons" && location.pathname.startsWith("/lesson"));

  const Item = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: typeof Home;
    label: string;
    path: string;
  }) => {
    const active = isActive(path);
    return (
      <Link
        to={path}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        {active && (
          <motion.div
            layoutId="desktop-nav-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Icon className="h-[18px] w-[18px]" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border bg-card/60 backdrop-blur-md flex-col">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 px-5 pt-6 pb-5">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center text-primary-foreground"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(265 60% 55%) 100%)",
          }}
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">Grohwie</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Design school, daily</p>
        </div>
      </Link>

      {/* Stats card */}
      <div className="mx-3 mb-4 rounded-2xl border border-border bg-background/60 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            Level {level}
          </span>
          <div className="flex items-center gap-1 rounded-full bg-[hsl(var(--ae-orange)/0.12)] text-[hsl(var(--ae-orange))] px-2 py-0.5">
            <Flame className="h-3 w-3" />
            <span className="text-[10px] font-semibold">{state.streak}</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground">{state.xp} XP</p>
        <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(state.xp % 500) / 5}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="ae-label px-3 mb-1.5">Main</p>
        {primary.map((t) => (
          <Item key={t.path} {...t} />
        ))}
        <p className="ae-label px-3 mt-5 mb-1.5">More</p>
        {secondary.map((t) => (
          <Item key={t.path} {...t} />
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground/70">
          v1.0 · Built for designers
        </p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
