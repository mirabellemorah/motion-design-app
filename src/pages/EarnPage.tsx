import { useState } from "react";
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
import { jobs as JOBS, type Job } from "@/data/jobs";
import JobDetailSheet from "@/components/JobDetailSheet";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const FILTERS = ["All", "Remote", "Full-time", "Contract", "Freelance"] as const;
type Filter = (typeof FILTERS)[number];

const EarnPage = () => {
  const navigate = useNavigate();
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [tab, setTab] = useState<"browse" | "saved">("browse");
  const [filter, setFilter] = useState<Filter>("All");
  const { saved, isSaved, toggle } = useSavedJobs();

  const matchesFilter = (j: Job) => {
    if (filter === "All") return true;
    if (filter === "Remote") return j.remote;
    return j.type === filter;
  };

  const visible = JOBS.filter(matchesFilter);
  const featured = visible.find((j) => j.featured) ?? visible[0];
  const rest = visible.filter((j) => j.id !== featured?.id);
  const savedJobs = JOBS.filter((j) => saved.includes(j.id));

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

      {/* Sub-tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-xl bg-secondary">
        {(["browse", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg py-2 text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "browse" ? "Browse" : `Saved${saved.length ? ` · ${saved.length}` : ""}`}
          </button>
        ))}
      </div>

      {tab === "browse" && (
        <>
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
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
              filter === f
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="soft-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No roles match this filter.</p>
          <button
            onClick={() => setFilter("All")}
            className="mt-3 text-xs font-semibold text-primary"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <>
      {/* Featured */}
      {featured && (
      <motion.button
        onClick={() => setActiveJob(featured)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="w-full text-left soft-card overflow-hidden mb-5 border-2 border-primary/30 hover:shadow-md transition-shadow"
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
          <div className="w-full rounded-xl py-2.5 text-center text-xs font-semibold bg-primary text-primary-foreground">
            View role
          </div>
        </div>
      </motion.button>
      )}

      {/* List */}
      {rest.length > 0 && (
      <>
      <div className="flex items-center justify-between mb-3">
        <span className="ae-label">More opportunities</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>{visible.length} active</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {rest.map((j, i) => (
          <motion.button
            key={j.id}
            onClick={() => setActiveJob(j)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.04 }}
            className="w-full text-left soft-card p-4 hover:shadow-md transition-shadow"
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
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(j.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(j.id);
                  }
                }}
                className={`p-1 -m-1 rounded transition-colors ${
                  isSaved(j.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={isSaved(j.id) ? "Unsave" : "Save"}
              >
                <Bookmark className={`h-4 w-4 ${isSaved(j.id) ? "fill-current" : ""}`} />
              </span>
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
          </motion.button>
        ))}
      </div>
      </>
      )}
        </>
      )}

      <p className="text-[10px] text-center text-muted-foreground/60 mt-6">
        Mock listings — connect your portfolio to apply
      </p>
        </>
      )}

      {tab === "saved" && (
        <div className="space-y-2.5">
          {savedJobs.length === 0 ? (
            <div className="soft-card p-8 text-center">
              <Bookmark className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground mb-1">No saved roles yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Tap the bookmark on any role to save it here.
              </p>
              <button
                onClick={() => setTab("browse")}
                className="rounded-xl px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground"
              >
                Browse roles
              </button>
            </div>
          ) : (
            savedJobs.map((j, i) => (
              <motion.button
                key={j.id}
                onClick={() => setActiveJob(j)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="w-full text-left soft-card p-4 hover:shadow-md transition-shadow"
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
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(j.id);
                    }}
                    className="p-1 -m-1 text-primary"
                    aria-label="Unsave"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{j.pay}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{j.location}</span>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      )}

      <JobDetailSheet job={activeJob} onClose={() => setActiveJob(null)} />
    </div>
  );
};

export default EarnPage;