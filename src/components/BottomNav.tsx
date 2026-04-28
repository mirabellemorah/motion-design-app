import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Trophy, Users, Briefcase, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: BookOpen, label: "Learn", path: "/lessons" },
  { icon: Briefcase, label: "Earn", path: "/earn" },
  { icon: Trophy, label: "Ranks", path: "/leaderboard" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  if (location.pathname === "/welcome") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-0.5 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.path === "/lessons" && location.pathname.startsWith("/lesson"));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 px-1 py-1.5 flex-1 min-w-0"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[9px] font-medium transition-colors truncate max-w-full ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
