import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import type { Job } from "@/data/jobs";
import { toast } from "sonner";
import { useSavedJobs } from "@/hooks/useSavedJobs";

interface Props {
  job: Job | null;
  onClose: () => void;
}

const JobDetailSheet = ({ job, onClose }: Props) => {
  const { isSaved, toggle } = useSavedJobs();
  const [applied, setApplied] = useState(false);
  const saved = job ? isSaved(job.id) : false;

  return (
    <AnimatePresence>
      {job && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-background shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 bg-background pt-2 pb-1 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Hero */}
            <div
              className="relative px-5 pt-3 pb-5 text-primary-foreground"
              style={{
                background: `linear-gradient(135deg, hsl(${job.companyHue} 60% 55%) 0%, hsl(${job.companyHue + 25} 55% 45%) 100%)`,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-4 h-8 w-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 mb-3">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">
                    {job.company}
                  </p>
                  <h2 className="text-lg font-semibold leading-tight">{job.role}</h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs opacity-95 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-semibold">{job.match}% match</span>
                <span className="opacity-70">·</span>
                <Clock className="h-3 w-3" />
                <span>{job.posted} ago</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/15 backdrop-blur p-2.5">
                  <p className="text-[9px] uppercase tracking-widest opacity-80 mb-0.5">Pay</p>
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {job.pay}
                  </p>
                </div>
                <div className="rounded-xl bg-white/15 backdrop-blur p-2.5">
                  <p className="text-[9px] uppercase tracking-widest opacity-80 mb-0.5">Type</p>
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {job.type}
                  </p>
                </div>
                <div className="rounded-xl bg-white/15 backdrop-blur p-2.5 col-span-2">
                  <p className="text-[9px] uppercase tracking-widest opacity-80 mb-0.5">Location</p>
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium text-secondary-foreground bg-secondary px-2.5 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-5">
              <section>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                  About the role
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{job.about}</p>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                  What you'll do
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                  What we're looking for
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-foreground/80">
                      <span className="text-primary mt-1">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                  Perks
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.perks.map((p) => (
                    <span
                      key={p}
                      className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky CTA — sits above the global bottom nav (h-16 + safe-area) */}
            <div
              className="sticky bg-background/95 backdrop-blur border-t border-border px-5 py-3 flex items-center gap-2"
              style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}
            >
              <button
                onClick={() => {
                  if (!job) return;
                  const nowSaved = toggle(job.id);
                  toast(nowSaved ? "Saved to your list" : "Removed from saved");
                }}
                className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors ${
                  saved
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
                aria-label="Save"
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${job.role} at ${job.company}`);
                  toast("Link copied");
                }}
                className="h-11 w-11 rounded-xl border border-border text-muted-foreground hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setApplied(true);
                  toast.success("Application sent — good luck!");
                }}
                disabled={applied}
                className="flex-1 h-11 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {applied ? "Application sent ✓" : "Apply now"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobDetailSheet;