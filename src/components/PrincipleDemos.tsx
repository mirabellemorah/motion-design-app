import { useState, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { Slider } from "@/components/ui/slider";

/* ======================================================================
   Per-principle interactive demos. Each is self-contained, uses design
   tokens, and replaces the bezier graph for the principles track.
====================================================================== */

export const ContrastDemo = () => {
  const [contrast, setContrast] = useState(50);
  const fg = `hsl(0 0% ${100 - contrast}%)`;
  const bg = `hsl(0 0% ${contrast < 50 ? 95 : 100}%)`;
  // Calc rough contrast ratio for display
  const ratio = (1 + contrast / 5).toFixed(1);
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="rounded-2xl p-6 text-center transition-colors" style={{ background: bg }}>
        <p className="text-2xl font-bold mb-1" style={{ color: fg }}>The Quick Brown Fox</p>
        <p className="text-sm" style={{ color: fg }}>Drag the slider to feel contrast change</p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="ae-label">Contrast</span>
          <span className="text-xs font-medium text-primary">~{ratio}:1</span>
        </div>
        <Slider value={[contrast]} onValueChange={([v]) => setContrast(v)} min={5} max={95} step={1} />
      </div>
      <p className="text-[11px] text-muted-foreground">WCAG AA requires 4.5:1 for body text.</p>
    </div>
  );
};

export const HierarchyDemo = () => {
  const [items, setItems] = useState([
    { id: "a", text: "Headline goes here", size: "text-2xl font-bold text-foreground" },
    { id: "b", text: "Supporting subtitle", size: "text-base font-medium text-foreground/80" },
    { id: "c", text: "Body copy explains the detail in calm prose.", size: "text-sm text-muted-foreground" },
    { id: "d", text: "META · 2 min read", size: "text-[10px] uppercase tracking-widest text-muted-foreground/70" },
  ]);
  return (
    <div className="soft-card p-4 space-y-3">
      <p className="text-[11px] text-muted-foreground">Drag to reorder — feel how hierarchy shifts.</p>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((it) => (
          <Reorder.Item
            key={it.id}
            value={it}
            className="cursor-grab active:cursor-grabbing rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <p className={it.size}>{it.text}</p>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export const ColorWheelDemo = () => {
  const [hue, setHue] = useState(280);
  const [scheme, setScheme] = useState<"complementary" | "analogous" | "triadic">("complementary");
  const swatches = (() => {
    if (scheme === "complementary") return [hue, (hue + 180) % 360];
    if (scheme === "analogous") return [(hue + 330) % 360, hue, (hue + 30) % 360];
    return [hue, (hue + 120) % 360, (hue + 240) % 360];
  })();
  // Color wheel: 12 hue arcs
  const arcs = Array.from({ length: 36 }).map((_, i) => i * 10);
  return (
    <div className="soft-card p-4 space-y-4">
      <div className="flex items-center justify-center">
        <div className="relative h-44 w-44">
          <svg viewBox="-100 -100 200 200" className="h-full w-full">
            {arcs.map((a) => {
              const a1 = (a - 5) * (Math.PI / 180);
              const a2 = (a + 5) * (Math.PI / 180);
              const r1 = 60, r2 = 95;
              const path = `M ${Math.cos(a1) * r1} ${Math.sin(a1) * r1} L ${Math.cos(a1) * r2} ${Math.sin(a1) * r2} A ${r2} ${r2} 0 0 1 ${Math.cos(a2) * r2} ${Math.sin(a2) * r2} L ${Math.cos(a2) * r1} ${Math.sin(a2) * r1} A ${r1} ${r1} 0 0 0 ${Math.cos(a1) * r1} ${Math.sin(a1) * r1} Z`;
              return <path key={a} d={path} fill={`hsl(${a} 75% 55%)`} />;
            })}
            {swatches.map((h, i) => {
              const ang = (h - 90) * (Math.PI / 180);
              const x = Math.cos(ang) * 78;
              const y = Math.sin(ang) * 78;
              return <circle key={i} cx={x} cy={y} r={10} fill="white" stroke="hsl(var(--foreground))" strokeWidth={2.5} />;
            })}
          </svg>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="ae-label">Base Hue</span>
          <span className="text-xs font-medium text-primary">{hue}°</span>
        </div>
        <Slider value={[hue]} onValueChange={([v]) => setHue(v)} min={0} max={360} step={1} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(["complementary", "analogous", "triadic"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScheme(s)}
            className={`rounded-xl px-2 py-1.5 text-[11px] font-medium border transition-colors ${
              scheme === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {swatches.map((h, i) => (
          <div key={i} className="flex-1 h-12 rounded-xl" style={{ background: `hsl(${h} 75% 55%)` }} />
        ))}
      </div>
    </div>
  );
};

export const BalanceDemo = () => {
  const [mode, setMode] = useState<"symmetric" | "asymmetric">("symmetric");
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="flex gap-2">
        {(["symmetric", "asymmetric"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border transition-colors ${
              mode === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="relative h-40 rounded-2xl bg-secondary overflow-hidden">
        {/* Fulcrum */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-3 w-12 rounded-t-md bg-foreground/30" />
        <div className="absolute bottom-5 left-4 right-4 h-1.5 rounded-full bg-foreground/20" />
        {mode === "symmetric" ? (
          <>
            <motion.div layout className="absolute bottom-7 left-8 h-12 w-12 rounded-2xl bg-primary" />
            <motion.div layout className="absolute bottom-7 right-8 h-12 w-12 rounded-2xl bg-primary" />
          </>
        ) : (
          <>
            <motion.div layout className="absolute bottom-7 left-6 h-16 w-16 rounded-2xl bg-primary" />
            <motion.div layout className="absolute bottom-7 right-6 h-8 w-8 rounded-2xl bg-[hsl(var(--ae-orange))]" />
            <motion.div layout className="absolute bottom-7 right-20 h-6 w-6 rounded-full bg-[hsl(var(--ae-yellow))]" />
          </>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">Both compositions feel balanced — only one is symmetrical.</p>
    </div>
  );
};

export const ProximityDemo = () => {
  const [gap, setGap] = useState(8);
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="rounded-2xl bg-secondary p-6">
        <div className="flex flex-col" style={{ gap: `${gap}px` }}>
          <div className="grid grid-cols-3" style={{ gap: `${Math.max(2, gap / 3)}px` }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-primary/80" />
            ))}
          </div>
          <div className="grid grid-cols-3" style={{ gap: `${Math.max(2, gap / 3)}px` }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-[hsl(var(--ae-orange))]/80" />
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="ae-label">Group Spacing</span>
          <span className="text-xs font-medium text-primary">{gap}px</span>
        </div>
        <Slider value={[gap]} onValueChange={([v]) => setGap(v)} min={2} max={48} step={1} />
      </div>
      <p className="text-[11px] text-muted-foreground">More gap = stronger separation between the two groups.</p>
    </div>
  );
};

export const AlignmentDemo = () => {
  const [aligned, setAligned] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setAligned(!aligned)}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border ${
            aligned ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
          }`}
        >
          {aligned ? "Aligned" : "Misaligned"}
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium border ${
            showGrid ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
          }`}
        >
          Grid {showGrid ? "On" : "Off"}
        </button>
      </div>
      <div className="relative rounded-2xl bg-secondary p-4 h-44 overflow-hidden">
        {showGrid && (
          <div className="absolute inset-0 opacity-40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l border-dashed border-primary/40" style={{ left: `${i * 25}%` }} />
            ))}
          </div>
        )}
        <div className="relative space-y-2">
          {["Headline", "Supporting line", "Tertiary detail"].map((t, i) => (
            <div
              key={i}
              className="rounded-lg bg-card px-3 py-2 text-xs text-foreground shadow-sm"
              style={{
                marginLeft: aligned ? 0 : `${[8, 22, 4][i]}px`,
                width: aligned ? "75%" : `${[70, 60, 80][i]}%`,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RepetitionDemo = () => {
  const [count, setCount] = useState(6);
  const [vary, setVary] = useState(false);
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="rounded-2xl bg-secondary p-4 min-h-[10rem] flex flex-wrap gap-2 items-center justify-center">
        {Array.from({ length: count }).map((_, i) => {
          const variant = vary ? i % 3 : 0;
          const sz = variant === 0 ? "h-10 w-10" : variant === 1 ? "h-12 w-12" : "h-8 w-8";
          const bg = variant === 0 ? "bg-primary" : variant === 1 ? "bg-[hsl(var(--ae-orange))]" : "bg-[hsl(var(--ae-yellow))]";
          return <div key={i} className={`${sz} ${bg} rounded-xl`} />;
        })}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="ae-label">Items</span>
          <span className="text-xs font-medium text-primary">{count}</span>
        </div>
        <Slider value={[count]} onValueChange={([v]) => setCount(v)} min={3} max={16} step={1} />
      </div>
      <button
        onClick={() => setVary(!vary)}
        className={`w-full rounded-xl px-3 py-2 text-xs font-medium border ${
          vary ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
        }`}
      >
        {vary ? "Rhythm with variation" : "Pure repetition"}
      </button>
    </div>
  );
};

export const TypographyDemo = () => {
  const [size, setSize] = useState(32);
  const [tracking, setTracking] = useState(0);
  const [weight, setWeight] = useState(600);
  return (
    <div className="soft-card p-4 space-y-3">
      <div className="rounded-2xl bg-secondary p-6 text-center">
        <p
          style={{
            fontSize: `${size}px`,
            letterSpacing: `${tracking / 100}em`,
            fontWeight: weight,
            lineHeight: 1.1,
          }}
          className="text-foreground"
        >
          Design speaks
        </p>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1"><span className="ae-label">Size</span><span className="text-xs text-primary">{size}px</span></div>
          <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={14} max={64} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span className="ae-label">Tracking</span><span className="text-xs text-primary">{tracking}</span></div>
          <Slider value={[tracking]} onValueChange={([v]) => setTracking(v)} min={-5} max={20} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><span className="ae-label">Weight</span><span className="text-xs text-primary">{weight}</span></div>
          <Slider value={[weight]} onValueChange={([v]) => setWeight(v)} min={300} max={800} step={100} />
        </div>
      </div>
    </div>
  );
};

import type { Lesson } from "@/data/lessons";

export const PrincipleDemo = ({ demo }: { demo: NonNullable<Lesson["demo"]> }) => {
  switch (demo) {
    case "contrast": return <ContrastDemo />;
    case "hierarchy": return <HierarchyDemo />;
    case "color-wheel": return <ColorWheelDemo />;
    case "balance": return <BalanceDemo />;
    case "proximity": return <ProximityDemo />;
    case "alignment": return <AlignmentDemo />;
    case "repetition": return <RepetitionDemo />;
    case "typography": return <TypographyDemo />;
    default: return null;
  }
};

export default PrincipleDemo;