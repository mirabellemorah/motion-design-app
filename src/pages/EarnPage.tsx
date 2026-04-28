import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  Bookmark,
  Building2,
  Zap,
  TrendingUp,
} from "lucide-react";

interface Job {
  id: string;
  role: string;
  company: string;
  type: "Full-time" | "Contract" | "Freelance" | "Part-time";
  location: string;
  remote: boolean;
  pay: string;
  posted: string;
  tags: string[];
  match: number;
  featured?: boolean;
}

const JOBS: Job[] = [
  {
    id: "j1",
    role: "Senior Motion Designer",
    company: "Stripe",
    type: "Full-time",
    location: "Remote · Worldwide",
    remote: true,
    pay: "$140k – $180k",
    posted: "2d",
    tags: ["After Effects", "Lottie", "UI Motion"],
    match: 94,
    featured: true,
  },
  {
    id: "j2",
    role: "Brand Animator",
    company: "Linear",
    type: "Contract",
    location: "Remote · EU",
    remote: true,
    pay: "$80 – $120 / hr",
    posted: "4d",
    tags: ["Motion", "Branding"],
    match: 88,
  },
  {
    id: "j3",
    role: "Product Designer (Motion)",
    company: "Arc Browser",
    type: "Full-time",
    location: "New York, NY",
    remote: false,
    pay: "$160k – $210k",
    posted: "1w",
    tags: ["Figma", "Prototyping", "Micro-interactions"],
    match: 81,
  },
  {
    id: "j4",
    role: "Freelance Logo Reveal",
    company: "Acme Studio",
    type: "Freelance",
    location: "Remote",
    remote: true,
    pay: "$2,500 fixed",
    posted: "1d",
    tags: ["Logo", "After Effects", "1 week"],
    match: 76,
  },
  {
    id: "j5",
    role: "Junior Motion Designer",
    company: "Notion",
    type: "Full-time",
    location: "San Francisco, CA",
    remote: false,
    pay: "$95k – $120k",
    posted: "3d",
    tags: ["Entry level", "Mentorship"],
    match: 72,
  },
];

const EarnPage = () => {
  const navigate = useNavigate();
  const featured = JOBS.find((j) => j.featured)!;
  const rest = JOBS.filter((j) => !j.featured);

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-5 flex items-center gap-3"
      >
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Earn</h1>
          <p className="text-xs text-muted-foreground">Opportunities matched to your skills</p>
        </div>
      </motion.div>

      {/* Stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-4 mb-5 text-primary-foreground"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(265 55% 60%) 100%)",
        }}
      >
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -right-12 top-8 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-medium opacity-90">
              Your match score
            </span>
          </div>
          <p className="text-3xl font-semibold">82<span className="text-base opacity-80"> / 100</span></p>
          <p className="text-xs opacity-90 mt-1">
            Complete 3 more lessons to unlock Senior roles
          </p>
        </div>
      </motion.div>

      {/* Quick filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {["All", "Remote", "Full-time", "Contract", "Freelance"].map((f, i) => (
          <button
            key={f}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
              i === 0
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="soft-card overflow-hidden mb-5 border-2 border-primary/30"
      >
        <div className="px-4 py-2 bg-primary/10 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">
            Featured · Top match
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{featured.role}</p>
              <p className="text-xs text-muted-foreground">
                {featured.company} · {featured.type}
              </p>
            </div>
            <span className="text-xs font-semibold text-primary">{featured.match}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="truncate">{featured.pay}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{featured.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {featured.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium text-secondary-foreground bg-secondary px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
          <button className="w-full rounded-xl py-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Apply now
          </button>
        </div>
      </motion.div>

      {/* List */}
      <div className="flex items-center justify-between mb-3">
        <span className="ae-label">More opportunities</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>{JOBS.length} active</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {rest.map((j, i) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.04 }}
            className="soft-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{j.role}</p>
                <p className="text-[11px] text-muted-foreground">
                  {j.company} · {j.type}
                </p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2.5">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{j.pay}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{j.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {j.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-primary">{j.match}% match</span>
                <span className="text-muted-foreground/60">·</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{j.posted}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-center text-muted-foreground/60 mt-6">
        Mock listings — connect your portfolio to apply
      </p>
    </div>
  );
};

export default EarnPage;