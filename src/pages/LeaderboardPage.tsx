import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Flame, Crown, Medal } from "lucide-react";

interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

const WEEKLY: LeaderEntry[] = [
  { rank: 1, name: "Maya K.", avatar: "🦊", xp: 4820, streak: 42, tier: "diamond" },
  { rank: 2, name: "Tomás R.", avatar: "🐧", xp: 4310, streak: 28, tier: "diamond" },
  { rank: 3, name: "Aiko S.", avatar: "🐼", xp: 3995, streak: 19, tier: "gold" },
  { rank: 4, name: "Leo B.", avatar: "🦁", xp: 3420, streak: 12, tier: "gold" },
  { rank: 5, name: "You", avatar: "🌟", xp: 2890, streak: 7, tier: "silver" },
  { rank: 6, name: "Priya N.", avatar: "🦋", xp: 2640, streak: 9, tier: "silver" },
  { rank: 7, name: "Jin W.", avatar: "🐯", xp: 2310, streak: 4, tier: "bronze" },
  { rank: 8, name: "Sara V.", avatar: "🦉", xp: 1980, streak: 6, tier: "bronze" },
  { rank: 9, name: "Diego M.", avatar: "🐺", xp: 1740, streak: 3, tier: "bronze" },
  { rank: 10, name: "Noor A.", avatar: "🐉", xp: 1530, streak: 2, tier: "bronze" },
];

const tierStyles: Record<LeaderEntry["tier"], string> = {
  diamond: "bg-primary/15 text-primary",
  gold: "bg-[hsl(var(--xp-gold)/0.18)] text-[hsl(var(--xp-gold))]",
  silver: "bg-secondary text-secondary-foreground",
  bronze: "bg-accent text-accent-foreground",
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const top3 = WEEKLY.slice(0, 3);
  const rest = WEEKLY.slice(3);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Leaderboard</h1>
          <p className="text-xs text-muted-foreground">Weekly XP — refreshes Sunday</p>
        </div>
      </motion.div>

      {/* Tier banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="soft-card p-4 mb-5 flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Silver Tier</p>
          <p className="text-xs text-muted-foreground">Earn 1,110 XP to reach Gold</p>
        </div>
        <span className="ae-label text-primary">RANK #5</span>
      </motion.div>

      {/* Podium */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const place = i === 1 ? 1 : i === 0 ? 2 : 3;
          const heights = [88, 110, 76];
          return (
            <div key={p.rank} className="flex flex-col items-center justify-end">
              <div className="text-2xl mb-1">{p.avatar}</div>
              <p className="text-xs font-medium text-foreground truncate max-w-full">{p.name}</p>
              <p className="text-[10px] text-muted-foreground mb-1.5">{p.xp.toLocaleString()} XP</p>
              <div
                className={`w-full rounded-t-xl flex items-start justify-center pt-2 ${
                  place === 1 ? "bg-primary/25" : place === 2 ? "bg-secondary" : "bg-accent"
                }`}
                style={{ height: heights[i] }}
              >
                {place === 1 ? (
                  <Crown className="h-4 w-4 text-primary" />
                ) : (
                  <Medal className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* List */}
      <div className="soft-card overflow-hidden">
        {rest.map((e, i) => {
          const isYou = e.name === "You";
          return (
            <motion.div
              key={e.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.03 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 ${
                isYou ? "bg-primary/8" : ""
              }`}
            >
              <span className="text-xs font-semibold text-muted-foreground w-5 text-center">{e.rank}</span>
              <span className="text-xl">{e.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isYou ? "font-semibold text-primary" : "font-medium text-foreground"}`}>
                  {e.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Flame className="h-3 w-3" />
                  <span>{e.streak} day streak</span>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${tierStyles[e.tier]}`}>
                {e.tier}
              </span>
              <span className="text-xs font-semibold text-foreground tabular-nums w-14 text-right">
                {e.xp.toLocaleString()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
