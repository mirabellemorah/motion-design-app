import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, MessageCircle, Bookmark, Send, Briefcase, MapPin, DollarSign, Sparkles } from "lucide-react";
import { jobs as ALL_JOBS, type Job } from "@/data/jobs";
import JobDetailSheet from "@/components/JobDetailSheet";

interface Post {
  id: string;
  author: string;
  hue: number;
  role: string;
  time: string;
  content: string;
  bezier?: [number, number, number, number];
  tag: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

const FEED: Post[] = [
  {
    id: "1",
    author: "Maya K.",
    hue: 265,
    role: "Senior Motion Designer · Stripe",
    time: "2h",
    content: "Spent the morning tuning a button hover. The trick: tiny overshoot on scale, but kill it on opacity. Otherwise the fade feels wobbly.",
    bezier: [0.2, 0.9, 0.3, 1.15],
    tag: "Micro-interactions",
    likes: 142,
    comments: 18,
  },
  {
    id: "2",
    author: "Tomás R.",
    hue: 210,
    role: "Product Designer",
    time: "5h",
    content: "Hot take: Easy Ease (F9) is the Comic Sans of motion. Always customize the handles. Always.",
    tag: "Hot Take",
    likes: 318,
    comments: 47,
  },
  {
    id: "3",
    author: "Aiko S.",
    hue: 340,
    role: "Animator · Pixar",
    time: "1d",
    content: "Anticipation isn't just for character animation. A 60ms pull-back before a modal opens makes it feel intentional, like the UI is breathing.",
    bezier: [0.7, -0.3, 0.4, 1],
    tag: "Principle",
    likes: 489,
    comments: 62,
  },
  {
    id: "4",
    author: "Priya N.",
    hue: 290,
    role: "Learning · Day 12",
    time: "1d",
    content: "First time my Speed Graph clicked today. The bell curve = ease in-out. Mind blown. Thanks to whoever made the speed graph lesson — it finally makes sense.",
    tag: "Wins",
    likes: 96,
    comments: 14,
  },
  {
    id: "5",
    author: "Leo B.",
    hue: 30,
    role: "Brand Designer",
    time: "2d",
    content: "Studied Apple's keynote transitions for a week. They almost never use linear. Even the cursor moves on a curve. Detail = trust.",
    tag: "Study",
    likes: 271,
    comments: 33,
  },
];

const TAGS = ["For You", "Wins", "Hot Take", "Principle", "Study", "Micro-interactions"];

interface CommunityJob {
  jobId: string;
  referrer: string;
  referrerRole: string;
  hue: number;
  note: string;
  posted: string;
}

const COMMUNITY_JOBS: CommunityJob[] = [
  {
    jobId: "j1",
    referrer: "Maya K.",
    referrerRole: "Senior Motion Designer · Stripe",
    hue: 265,
    note: "My team is hiring. DM me before applying — I'll route your portfolio directly to the hiring manager.",
    posted: "1d",
  },
  {
    jobId: "j4",
    referrer: "Leo B.",
    referrerRole: "Brand Designer",
    hue: 30,
    note: "Worked with Acme last year — clean briefs, fast pay, friendly art director. Recommended for first freelance gig.",
    posted: "2d",
  },
  {
    jobId: "j5",
    referrer: "Priya N.",
    referrerRole: "Learning · Day 12",
    hue: 290,
    note: "Notion's junior role looks legit — they list a real mentor and a path to mid. Saving for when I'm ready.",
    posted: "3d",
  },
];

const initials = (name: string) =>
  name === "You" ? "Y" : name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const Avatar = ({ name, hue, size = 36 }: { name: string; hue: number; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
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

const MiniCurve = ({ b }: { b: [number, number, number, number] }) => {
  const w = 80, h = 50, p = 6;
  const iw = w - p * 2, ih = h - p * 2;
  const points: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const u = 1 - t;
    const x = (u * u * u * 0 + 3 * u * u * t * b[0] + 3 * u * t * t * b[2] + t * t * t * 1) * iw + p;
    const yV = u * u * u * 0 + 3 * u * u * t * b[1] + 3 * u * t * t * b[3] + t * t * t * 1;
    const y = ih - yV * ih + p;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} className="rounded-lg bg-secondary">
      <path d={points.join(" ")} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
};

const CommunityPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"feed" | "jobs">("feed");
  const [activeTag, setActiveTag] = useState("For You");
  const [posts, setPosts] = useState(FEED);
  const [draft, setDraft] = useState("");
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const toggleLike = (id: string) => {
    setPosts(posts.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const submit = () => {
    if (!draft.trim()) return;
    setPosts([
      {
        id: Date.now().toString(),
        author: "You",
        hue: 265,
        role: "Learning · Day 7",
        time: "now",
        content: draft.trim(),
        tag: "Wins",
        likes: 0,
        comments: 0,
      },
      ...posts,
    ]);
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-24 pt-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Community</h1>
          <p className="text-xs text-muted-foreground">Notes from designers learning motion</p>
        </div>
      </motion.div>

      {/* Sub-tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-xl bg-secondary">
        {(["feed", "jobs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg py-2 text-xs font-semibold capitalize transition-all ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "feed" ? "Feed" : "Jobs board"}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <>
      {/* Composer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="soft-card p-3 mb-4 flex items-center gap-2"
      >
        <Avatar name="You" hue={265} size={32} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Share a curve, a win, or a question…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-30 transition-opacity"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* Tag filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1 scrollbar-hide">
        {TAGS.map((t) => {
          const isActive = activeTag === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                isActive
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {posts
          .filter(p => activeTag === "For You" || p.tag === activeTag)
          .map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="soft-card p-4"
            >
              <div className="flex items-start gap-3 mb-2">
                <Avatar name={p.author} hue={p.hue} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-foreground">{p.author}</p>
                    <span className="text-[10px] text-muted-foreground">· {p.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{p.role}</p>
                </div>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {p.tag}
                </span>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-3">{p.content}</p>

              {p.bezier && (
                <div className="flex items-center gap-3 mb-3 p-2 bg-secondary/50 rounded-xl">
                  <MiniCurve b={p.bezier} />
                  <div className="flex-1 min-w-0">
                    <p className="ae-label mb-0.5">Shared curve</p>
                    <p className="text-[10px] font-mono text-foreground/70 truncate">
                      cubic-bezier({p.bezier.join(", ")})
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button
                  onClick={() => toggleLike(p.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    p.liked ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${p.liked ? "fill-current" : ""}`} />
                  <span>{p.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{p.comments}</span>
                </button>
                <button className="ml-auto text-muted-foreground hover:text-foreground">
                  <Bookmark className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
        </>
      )}

      {tab === "jobs" && (
        <div className="space-y-3">
          <div className="soft-card p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Referred by community</p>
              <p className="text-[11px] text-muted-foreground">Roles vouched for by other designers here</p>
            </div>
          </div>

          {COMMUNITY_JOBS.map((cj, i) => {
            const job = ALL_JOBS.find((j) => j.id === cj.jobId);
            if (!job) return null;
            return (
              <motion.div
                key={cj.jobId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="soft-card p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={cj.referrer} hue={cj.hue} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-foreground">{cj.referrer}</p>
                      <span className="text-[10px] text-muted-foreground">· {cj.posted}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{cj.referrerRole}</p>
                  </div>
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Referral
                  </span>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed mb-3 italic">
                  "{cj.note}"
                </p>

                <button
                  onClick={() => setActiveJob(job)}
                  className="w-full text-left rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-accent/40 transition-all"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{job.role}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {job.company} · {job.type}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-primary">{job.match}%</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{job.pay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}

          <p className="text-[10px] text-center text-muted-foreground/60 pt-2">
            Want to refer a role? Tap the compose icon in Feed.
          </p>
        </div>
      )}

      <JobDetailSheet job={activeJob} onClose={() => setActiveJob(null)} />
    </div>
  );
};

export default CommunityPage;
