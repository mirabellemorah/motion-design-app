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

const Stat = ({ label, value, Icon }: { label: string; value: string | number; Icon: LucideIcon }) => (
  <div className="soft-card p-3 flex-1">
    <Icon className="h-4 w-4 text-primary mb-1.5" />
    <p className="text-lg font-semibold text-foreground leading-none">{value}</p>
    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

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

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </motion.div>

      {/* Identity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-5 text-primary-foreground"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(265 55% 60%) 100%)" }}
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg font-semibold">
            AK
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold">Alex Kim</p>
            <p className="text-xs opacity-90">Motion Apprentice · Lvl 4</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
            <Flame className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">7</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-2 mb-5">
        <Stat label="Started" value={started} Icon={BookOpen} />
        <Stat label="Completed" value={completed} Icon={CheckCircle2} />
        <Stat label="Badges" value={badges} Icon={Award} />
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <p className="ae-label mb-2">Account</p>
        <div className="soft-card overflow-hidden">
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

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-5">
        <p className="ae-label mb-2">Learning Preferences</p>
        <div className="soft-card p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Skill level</p>
            <div className="flex gap-2">
              {(["beginner", "intermediate", "advanced"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSkill(s)}
                  className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-medium border capitalize transition-colors ${
                    skill === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Areas of interest</p>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((i) => {
                const on = picked.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => togglePick(i)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
                      on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-5">
        <p className="ae-label mb-2">Progress Overview</p>
        <div className="soft-card p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total lessons</span>
            <span className="font-medium text-foreground">{completed} / {lessons.length}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(completed / lessons.length) * 100}%` }} />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--ae-yellow))]" />
            <p className="text-[11px] text-muted-foreground">
              You're 40% faster than last month — keep the streak alive.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sign out */}
      <button
        onClick={() => alert("Logged out")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-card text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
};

export default ProfilePage;