import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Flame, Crown, Medal, Zap } from "lucide-react";

interface LeaderEntry {
  rank: number;
  name: string;
  hue: number;
  xp: number;
  streak: number;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

const WEEKLY: LeaderEntry[] = [
  { rank: 1, name: "Maya K.", hue: 265, xp: 4820, streak: 42, tier: "diamond" },
  { rank: 2, name: "Tomás R.", hue: 210, xp: 4310, streak: 28, tier: "diamond" },
  { rank: 3, name: "Aiko S.", hue: 340, xp: 3995, streak: 19, tier: "gold" },
  { rank: 4, name: "Leo B.", hue: 30, xp: 3420, streak: 12, tier: "gold" },
  { rank: 5, name: "You", hue: 265, xp: 2890, streak: 7, tier: "silver" },
  { rank: 6, name: "Priya N.", hue: 290, xp: 2640, streak: 9, tier: "silver" },
  { rank: 7, name: "Jin W.", hue: 15, xp: 2310, streak: 4, tier: "bronze" },
  { rank: 8, name: "Sara V.", hue: 180, xp: 1980, streak: 6, tier: "bronze" },
  { rank: 9, name: "Diego M.", hue: 240, xp: 1740, streak: 3, tier: "bronze" },
  { rank: 10, name: "Noor A.", hue: 130, xp: 1530, streak: 2, tier: "bronze" },
];

const initials = (name: string) =>
  name === "You" ? "Y" : name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const Avatar = ({ name, hue, size = 36 }: { name: string; hue: number; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0 border-2 border-white/20"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, hsl(${hue} 65% 65%), hsl(${hue} 55% 50%))`,
      fontSize: size * 0.38,
    }}
  >
    {initials(name)}
  </div>
);

const tierStyles: Record<LeaderEntry["tier"], { chip: string; label: string }> = {
  diamond: { chip: "bg-primary text-primary-foreground", label: "DIAMOND" },
  gold: { chip: "bg-[hsl(45_85%_55%)] text-black", label: "GOLD" },
  silver: { chip: "bg-secondary text-secondary-foreground", label: "SILVER" },
  bronze: { chip: "bg-accent text-accent-foreground", label: "BRONZE" },
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const top3 = WEEKLY.slice(0, 3);
  const rest = WEEKLY.slice(3);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-6 lg:px-8 lg:pt-8">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Home
      </motion.button>

      {/* Bold header tile */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-tile bento-ink p-6 mb-4 relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-lime/10 pointer-events-none" />
        <span className="sticker sticker-lime mb-3 inline-block">Weekly XP</span>
        <h1 className="text-display-xl text-4xl text-white mb-1">LEADERBOARD</h1>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Refreshes Sunday · All-time streak counts</p>

        {/* Your rank callout */}
        <div className="mt-4 flex items-center gap-3 bg-white/8 rounded-2xl p-3 border border-white/10">
          <div className="h-9 w-9 rounded-xl bg-primary/30 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-black">RANK #5 — Silver Tier</p>
            <p className="text-white/40 text-[10px]">Earn 1,110 XP to reach Gold</p>
          </div>
          <div className="flex items-center gap-1 bg-lime text-lime-foreground rounded-full px-2.5 py-1">
            <Flame className="h-3 w-3" />
            <span className="text-[10px] font-black">7</span>
          </div>
        </div>
      </motion.div>

      {/* Podium — bento grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        {/* 2nd place */}
        {[
          { entry: top3[1], place: 2, height: 88, tileClass: "bento-cream border-2 border-border" },
          { entry: top3[0], place: 1, height: 112, tileClass: "bento-violet" },
          { entry: top3[2], place: 3, height: 72, tileClass: "bento-cream border-2 border-border" },
        ].map(({ entry, place, height, tileClass }) => (
          <div key={entry.rank} className={`bento-tile ${tileClass} p-3 flex flex-col items-center justify-end gap-1.5`}
            style={{ minHeight: height + 80 }}>
            {place === 1 ? (
              <Crown className="h-5 w-5 text-lime mb-1" />
            ) : (
              <Medal className="h-4 w-4 text-white/40 mb-1" />
            )}
            <Avatar name={entry.name} hue={entry.hue} size={place === 1 ? 44 : 36} />
            <p className={`text-[11px] font-black text-center truncate max-w-full ${place === 1 ? "text-white" : "text-foreground"}`}>
              {entry.name}
            </p>
            <p className={`text-[10px] font-bold ${place === 1 ? "text-white/60" : "text-muted-foreground"}`}>
              {entry.xp.toLocaleString()}
            </p>
            <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${
              place === 1 ? "bg-lime text-lime-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              #{entry.rank}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Rest of list */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bento-tile bento-cream border-2 border-border overflow-hidden p-0"
      >
        {rest.map((e, i) => {
          const isYou = e.name === "You";
          const tier = tierStyles[e.tier];
          return (
            <motion.div
              key={e.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.03 }}
              className={`flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 ${
                isYou ? "bg-primary/8" : ""
              }`}
            >
              <span className={`text-xs font-black w-5 text-center ${isYou ? "text-primary" : "text-muted-foreground"}`}>
                {e.rank}
              </span>
              <Avatar name={e.name} hue={e.hue} size={32} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-black ${isYou ? "text-primary" : "text-foreground"}`}>
                  {e.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Flame className="h-3 w-3" />
                  <span>{e.streak}d streak</span>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.chip}`}>
                {tier.label}
              </span>
              <div className="flex items-center gap-1 text-right">
                <Zap className="h-3 w-3 text-primary opacity-60" />
                <span className="text-xs font-black text-foreground tabular-nums">
                  {e.xp.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
