import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  KeyRound,
  Bell,
  Award,
  BookOpen,
  CheckCircle2,
  LogOut,
  Sparkles,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { lessons } from "@/data/lessons";

const Row = ({
  Icon,
  label,
  value,
  onClick,
  trailing,
}: {
  Icon: LucideIcon;
  label: string;
  value?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
  >
    <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {value && <p className="text-xs text-muted-foreground truncate">{value}</p>}
    </div>
    {trailing ?? <ChevronRight className="h-4 w-4 text-muted-foreground/40" />}
  </button>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [notif, setNotif] = useState(true);
  const [skill, setSkill] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const interests = ["Motion", "Brand", "UI", "Type", "3D", "Illustration"];
  const [picked, setPicked] = useState<string[]>(["Motion", "Brand"]);
  const togglePick = (i: string) =>
    setPicked(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]));

  const completed = 4;
  const started = 8;
  const badges = 3;
  const progressPct = Math.round((completed / lessons.length) * 100);

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

      {/* Hero tile — ink */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-tile bento-ink p-6 mb-4 relative overflow-hidden"
      >
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 -bottom-8 h-24 w-24 rounded-full bg-lime/10 pointer-events-none" />

        <div className="relative flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-xl font-black text-white">
            AK
          </div>
          <div className="flex-1">
            <p className="text-display-xl text-2xl text-white">ALEX KIM</p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-0.5">
              Motion Apprentice · Lvl 4
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-lime text-lime-foreground rounded-full px-3 py-1.5">
            <Flame className="h-3.5 w-3.5" />
            <span className="text-xs font-black">7</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Overall Progress</span>
            <span className="text-white font-black text-sm">{progressPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-white/30 mt-1">{completed} of {lessons.length} lessons completed</p>
        </div>
      </motion.div>

      {/* Stats bento row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        {[
          { label: "STARTED", value: started, Icon: BookOpen, variant: "bento-cream" },
          { label: "DONE", value: completed, Icon: CheckCircle2, variant: "bento-lime" },
          { label: "BADGES", value: badges, Icon: Award, variant: "bento-violet" },
        ].map(({ label, value, Icon, variant }) => (
          <div key={label} className={`bento-tile ${variant} p-4 flex flex-col items-start gap-2`}>
            <Icon className={`h-5 w-5 ${variant === "bento-lime" ? "text-ink" : variant === "bento-violet" ? "text-white" : "text-primary"}`} />
            <p className={`text-2xl font-black leading-none ${variant === "bento-lime" ? "text-ink" : variant === "bento-violet" ? "text-white" : "text-foreground"}`}>
              {value}
            </p>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${variant === "bento-lime" ? "text-ink/50" : variant === "bento-violet" ? "text-white/50" : "text-muted-foreground"}`}>
              {label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Skill level */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
        <div className="mb-2"><span className="sticker sticker-ink">Skill Level</span></div>
        <div className="bento-tile bento-cream border-2 border-border p-4">
          <div className="flex gap-2">
            {(["beginner", "intermediate", "advanced"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSkill(s)}
                className={`flex-1 rounded-xl px-2 py-2.5 text-[11px] font-black border capitalize transition-all ${
                  skill === s
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-4">
        <div className="mb-2"><span className="sticker sticker-lime">Interests</span></div>
        <div className="bento-tile bento-cream border-2 border-border p-4">
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => {
              const on = picked.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => togglePick(i)}
                  className={`rounded-full px-4 py-1.5 text-xs font-black border transition-all ${
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Account settings */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
        <div className="mb-2"><span className="sticker sticker-ink">Account</span></div>
        <div className="bento-tile bento-cream border-2 border-border overflow-hidden p-0">
          <Row Icon={Mail} label="Email" value="alex@studio.design" />
          <Row Icon={KeyRound} label="Password" value="•••••••• · last changed 2 mo ago" />
          <Row
            Icon={Bell}
            label="Notifications"
            value={notif ? "Daily lesson reminders on" : "All notifications muted"}
            trailing={<Switch checked={notif} onCheckedChange={setNotif} />}
            onClick={() => setNotif(!notif)}
          />
        </div>
      </motion.div>

      {/* Pro tip */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 bento-tile bento-violet p-5">
        <p className="sticker sticker-lime mb-2 inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Your Progress
        </p>
        <p className="text-xs leading-relaxed text-white/90">
          You're 40% faster than last month — keep the streak alive. Complete 4 more lessons to reach Level 5 and unlock the Timing & Easing Mastery badge.
        </p>
      </motion.div>

      {/* Sign out */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <button
          onClick={() => alert("Logged out")}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-border bg-card text-sm font-black uppercase tracking-wide text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
