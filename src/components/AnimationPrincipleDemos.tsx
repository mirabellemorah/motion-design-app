import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Play, RotateCw } from "lucide-react";
import type { Lesson } from "@/data/lessons";

/* Reusable shell so every demo has the same look. */
const Shell = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="soft-card p-4 space-y-3">
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-44 rounded-2xl bg-secondary overflow-hidden">{children}</div>
);

const Btn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
  >
    {children}
  </button>
);

/* ---------------- 1. Squash & Stretch ---------------- */
const SquashStretchDemo = () => {
  const [intensity, setIntensity] = useState(50);
  const [trigger, setTrigger] = useState(0);
  const sx = 1 + intensity / 200;
  const sy = 1 - intensity / 250;
  return (
    <Shell hint="Volume preserved: as it stretches in one axis it contracts in the other.">
      <Stage>
        <div className="absolute bottom-3 left-0 right-0 h-px bg-foreground/20" />
        <motion.div
          key={trigger}
          initial={{ y: -120, scaleY: sy, scaleX: sx }}
          animate={{
            y: [-120, 0, 0, -60, 0],
            scaleY: [sy, 1 / sy, 1, sy, 1],
            scaleX: [sx, sx * 1.4, 1, sx, 1],
          }}
          transition={{ duration: 1.6, times: [0, 0.45, 0.55, 0.85, 1], ease: "easeInOut" }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-primary"
          style={{ originY: 1 }}
        />
      </Stage>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="ae-label">Squash intensity</span>
          <span className="text-xs font-medium text-primary">{intensity}%</span>
        </div>
        <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} min={0} max={100} />
      </div>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <Play className="h-3.5 w-3.5" /> Drop ball
      </Btn>
    </Shell>
  );
};

/* ---------------- 2. Anticipation ---------------- */
const AnticipationDemo = () => {
  const [on, setOn] = useState(true);
  const [trigger, setTrigger] = useState(0);
  return (
    <Shell hint="Tap launch with anticipation off — feels random. With it on — feels intentional.">
      <Stage>
        <div className="absolute bottom-3 left-0 right-0 h-px bg-foreground/20" />
        <motion.div
          key={`${trigger}-${on}`}
          initial={{ y: 0 }}
          animate={on ? { y: [0, 18, -110, 0] } : { y: [0, -110, 0] }}
          transition={{
            duration: 1.4,
            times: on ? [0, 0.3, 0.7, 1] : [0, 0.5, 1],
            ease: "easeInOut",
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 h-14 w-12 rounded-2xl bg-primary"
        />
      </Stage>
      <div className="flex gap-2">
        <button
          onClick={() => setOn(!on)}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border ${on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
        >
          Anticipation: {on ? "On" : "Off"}
        </button>
        <Btn onClick={() => setTrigger((t) => t + 1)}>
          <Play className="h-3.5 w-3.5" /> Launch
        </Btn>
      </div>
    </Shell>
  );
};

/* ---------------- 3. Staging ---------------- */
const StagingDemo = () => {
  const [good, setGood] = useState(true);
  return (
    <Shell hint="Strong staging = one obvious focal point. Bad staging = the eye doesn't know where to land.">
      <Stage>
        {good ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="h-20 w-20 rounded-3xl bg-primary shadow-lg shadow-primary/30"
              />
            </div>
            <div className="absolute top-3 left-3 h-3 w-12 rounded-full bg-foreground/15" />
            <div className="absolute bottom-3 right-3 h-3 w-16 rounded-full bg-foreground/15" />
          </>
        ) : (
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 1.2 + (i % 3) * 0.4, repeat: Infinity, delay: i * 0.05 }}
                className="rounded-xl bg-primary/70"
              />
            ))}
          </div>
        )}
      </Stage>
      <div className="flex gap-2">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            onClick={() => setGood(v)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border ${good === v ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
          >
            {v ? "Good staging" : "Poor staging"}
          </button>
        ))}
      </div>
    </Shell>
  );
};

/* ---------------- 4. Straight-Ahead vs Pose-to-Pose ---------------- */
const StraightPoseDemo = () => {
  const [mode, setMode] = useState<"pose" | "straight">("pose");
  const [trigger, setTrigger] = useState(0);
  const poseFrames = [0, 80, 160, 240];
  return (
    <Shell hint="Pose-to-pose: predictable, controlled. Straight-ahead: spontaneous, organic.">
      <Stage>
        <div className="absolute bottom-6 left-0 right-0 h-px bg-foreground/20" />
        {mode === "pose" ? (
          poseFrames.map((x, i) => (
            <motion.div
              key={`${trigger}-${i}`}
              initial={{ x, y: 0, opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3] }}
              transition={{ delay: i * 0.35, duration: 0.8 }}
              className="absolute bottom-7 h-8 w-8 rounded-full bg-primary"
              style={{ left: x, opacity: 0.6 }}
            />
          ))
        ) : (
          <motion.div
            key={trigger}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, 60, 110, 170, 230],
              y: [0, -30, 10, -20, 0],
            }}
            transition={{ duration: 1.4, ease: "linear" }}
            className="absolute bottom-7 h-8 w-8 rounded-full bg-primary"
          />
        )}
      </Stage>
      <div className="flex gap-2">
        {(["pose", "straight"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border capitalize ${mode === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
          >
            {m === "pose" ? "Pose to pose" : "Straight ahead"}
          </button>
        ))}
      </div>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <Play className="h-3.5 w-3.5" /> Replay
      </Btn>
    </Shell>
  );
};

/* ---------------- 5. Follow Through & Overlapping ---------------- */
const FollowThroughDemo = () => {
  const [trigger, setTrigger] = useState(0);
  return (
    <Shell hint="The body stops — the trailing parts keep going, then settle.">
      <Stage>
        <motion.div
          key={trigger}
          initial={{ x: -80 }}
          animate={{ x: [-80, 80, 80] }}
          transition={{ duration: 1, times: [0, 0.6, 1], ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 flex items-center gap-1"
        >
          <div className="h-10 w-10 rounded-2xl bg-primary" />
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: [0, -25 + i * 4, 8 - i, -3, 0] }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: "easeOut" }}
              className="h-2 w-6 rounded-full"
              style={{ background: "hsl(var(--ae-orange))", originX: 0 }}
            />
          ))}
        </motion.div>
      </Stage>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <RotateCw className="h-3.5 w-3.5" /> Replay
      </Btn>
    </Shell>
  );
};

/* ---------------- 6. Slow In / Slow Out ---------------- */
const SlowInOutDemo = () => {
  const [eased, setEased] = useState(true);
  const [trigger, setTrigger] = useState(0);
  return (
    <Shell hint="Linear motion looks robotic. Eased motion accelerates and decelerates like real objects.">
      <Stage>
        <div className="absolute top-12 left-0 right-0 h-px bg-foreground/15" />
        <div className="absolute top-28 left-0 right-0 h-px bg-foreground/15" />
        <p className="absolute top-7 left-3 text-[10px] uppercase tracking-widest text-muted-foreground">Linear</p>
        <p className="absolute top-23 left-3 text-[10px] uppercase tracking-widest text-muted-foreground">Eased</p>
        <motion.div
          key={`l-${trigger}`}
          initial={{ x: 0 }}
          animate={{ x: 240 }}
          transition={{ duration: 1.6, ease: "linear" }}
          className="absolute top-9 h-7 w-7 rounded-full bg-foreground/40"
        />
        <motion.div
          key={`e-${trigger}`}
          initial={{ x: 0 }}
          animate={{ x: 240 }}
          transition={{ duration: 1.6, ease: [0.42, 0, 0.58, 1] }}
          className="absolute top-25 h-7 w-7 rounded-full bg-primary"
        />
      </Stage>
      <div className="flex gap-2">
        <Btn onClick={() => setTrigger((t) => t + 1)}>
          <RotateCw className="h-3.5 w-3.5" /> Replay both
        </Btn>
      </div>
    </Shell>
  );
};

/* ---------------- 7. Arc ---------------- */
const ArcDemo = () => {
  const [trigger, setTrigger] = useState(0);
  return (
    <Shell hint="Throw it in a straight line — looks fake. Throw it on an arc — feels physical.">
      <Stage>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 176">
          <path d="M 20 150 Q 140 -10 260 150" fill="none" stroke="hsl(var(--primary)/0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
        <motion.div
          key={trigger}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute h-6 w-6 rounded-full bg-primary"
          style={{
            offsetPath: "path('M 20 150 Q 140 -10 260 150')",
            offsetRotate: "auto",
            top: 0,
            left: 0,
          }}
        />
      </Stage>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <Play className="h-3.5 w-3.5" /> Throw
      </Btn>
    </Shell>
  );
};

/* ---------------- 8. Secondary Action ---------------- */
const SecondaryDemo = () => {
  const [on, setOn] = useState(true);
  const [trigger, setTrigger] = useState(0);
  return (
    <Shell hint="Primary: scale-in. Secondary: shadow softens, tag drifts. Together = personality.">
      <Stage>
        <motion.div
          key={`p-${trigger}`}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.4, 0.64, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-20 w-32 rounded-2xl bg-primary shadow-xl shadow-primary/30 flex items-center justify-center text-primary-foreground text-xs font-semibold">
            Card
          </div>
        </motion.div>
        {on && (
          <>
            <motion.div
              key={`s1-${trigger}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute top-3 right-3 rounded-full bg-[hsl(var(--ae-yellow))] px-2 py-0.5 text-[10px] font-bold text-foreground"
            >
              NEW
            </motion.div>
            <motion.div
              key={`s2-${trigger}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 h-2 w-28 rounded-full bg-foreground blur-sm"
            />
          </>
        )}
      </Stage>
      <div className="flex gap-2">
        <button
          onClick={() => setOn(!on)}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border ${on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
        >
          Secondary: {on ? "On" : "Off"}
        </button>
        <Btn onClick={() => setTrigger((t) => t + 1)}>
          <RotateCw className="h-3.5 w-3.5" /> Replay
        </Btn>
      </div>
    </Shell>
  );
};

/* ---------------- 9. Timing ---------------- */
const TimingDemo = () => {
  const [ms, setMs] = useState(300);
  const [trigger, setTrigger] = useState(0);
  const tone = ms < 200 ? "Snappy" : ms < 400 ? "Balanced" : ms < 700 ? "Calm" : "Sluggish";
  return (
    <Shell hint="Same animation, different speed = totally different meaning.">
      <Stage>
        <motion.div
          key={`${trigger}-${ms}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: ms / 1000, ease: [0.2, 0, 0.2, 1] }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 h-14 w-32 rounded-2xl bg-primary"
        />
      </Stage>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="ae-label">Duration</span>
          <span className="text-xs font-medium text-primary">{ms}ms · {tone}</span>
        </div>
        <Slider value={[ms]} onValueChange={([v]) => setMs(v)} min={80} max={1200} step={20} />
      </div>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <RotateCw className="h-3.5 w-3.5" /> Replay
      </Btn>
    </Shell>
  );
};

/* ---------------- 10. Exaggeration ---------------- */
const ExaggerationDemo = () => {
  const [amt, setAmt] = useState(40);
  const [trigger, setTrigger] = useState(0);
  const overshoot = 1 + amt / 60;
  return (
    <Shell hint="Pure realism feels flat. Push past it — overshoots POP.">
      <Stage>
        <motion.div
          key={`${trigger}-${amt}`}
          initial={{ scale: 0 }}
          animate={{ scale: [0, overshoot, 0.95, 1] }}
          transition={{ duration: 0.8, times: [0, 0.55, 0.85, 1], ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-primary" />
        </motion.div>
      </Stage>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="ae-label">Exaggeration</span>
          <span className="text-xs font-medium text-primary">{amt}%</span>
        </div>
        <Slider value={[amt]} onValueChange={([v]) => setAmt(v)} min={0} max={100} />
      </div>
      <Btn onClick={() => setTrigger((t) => t + 1)}>
        <RotateCw className="h-3.5 w-3.5" /> Replay
      </Btn>
    </Shell>
  );
};

/* ---------------- 11. Solid Drawing ---------------- */
const SolidDrawingDemo = () => {
  const [rot, setRot] = useState(20);
  return (
    <Shell hint="Even flat shapes feel 3D when their volume rotates consistently.">
      <Stage>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-24 w-24 rounded-xl"
            style={{
              background: "hsl(var(--primary))",
              transform: `perspective(400px) rotateX(${rot}deg) rotateY(${rot}deg)`,
              boxShadow: "0 20px 40px -10px hsl(var(--primary)/0.4)",
            }}
          />
        </div>
      </Stage>
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="ae-label">Rotation</span>
          <span className="text-xs font-medium text-primary">{rot}°</span>
        </div>
        <Slider value={[rot]} onValueChange={([v]) => setRot(v)} min={-60} max={60} />
      </div>
    </Shell>
  );
};

/* ---------------- 12. Appeal ---------------- */
const AppealDemo = () => {
  const [variant, setVariant] = useState<"calm" | "playful" | "bold">("playful");
  const cfg: Record<"calm" | "playful" | "bold", { color: string; scale: number[]; dur: number; label: string }> = {
    calm: { color: "hsl(var(--primary))", scale: [1, 1.03, 1], dur: 2.4, label: "Apple-like calm" },
    playful: { color: "hsl(var(--ae-orange))", scale: [1, 1.18, 0.95, 1.05, 1], dur: 1.4, label: "Duolingo-like bounce" },
    bold: { color: "hsl(var(--ae-yellow))", scale: [1, 1.3, 1], dur: 0.6, label: "Snappy, confident" },
  };
  const c = cfg[variant];
  return (
    <Shell hint="Same shape, three personalities. Appeal = consistent motion voice.">
      <Stage>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={variant}
            animate={{ scale: c.scale }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut" }}
            className="h-20 w-20 rounded-3xl shadow-lg"
            style={{ background: c.color, boxShadow: `0 20px 30px -10px ${c.color}` }}
          />
        </div>
        <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          {c.label}
        </p>
      </Stage>
      <div className="flex gap-2">
        {(["calm", "playful", "bold"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`flex-1 rounded-xl px-2 py-2 text-xs font-medium border capitalize ${variant === v ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
          >
            {v}
          </button>
        ))}
      </div>
    </Shell>
  );
};

const AnimationPrincipleDemo = ({ demo }: { demo: NonNullable<Lesson["animDemo"]> }) => {
  switch (demo) {
    case "squash-stretch": return <SquashStretchDemo />;
    case "anticipation": return <AnticipationDemo />;
    case "staging": return <StagingDemo />;
    case "straight-pose": return <StraightPoseDemo />;
    case "follow-through": return <FollowThroughDemo />;
    case "slow-in-out": return <SlowInOutDemo />;
    case "arc": return <ArcDemo />;
    case "secondary": return <SecondaryDemo />;
    case "timing": return <TimingDemo />;
    case "exaggeration": return <ExaggerationDemo />;
    case "solid-drawing": return <SolidDrawingDemo />;
    case "appeal": return <AppealDemo />;
    default: return null;
  }
};

export default AnimationPrincipleDemo;