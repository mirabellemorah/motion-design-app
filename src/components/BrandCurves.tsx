import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveBezierGraph from "./InteractiveBezierGraph";

interface BrandCurve {
  brand: string;
  name: string;
  bezier: [number, number, number, number];
  description: string;
  usage: string;
  color: string;
}

const BRAND_CURVES: BrandCurve[] = [
  {
    brand: "Apple",
    name: "Default Ease",
    bezier: [0.25, 0.1, 0.25, 1],
    description: "Apple's signature curve — smooth, refined, premium. Used across iOS, macOS, and visionOS. It accelerates gently and decelerates generously.",
    usage: "Sheet presentations, modal transitions, spring-loaded UI",
    color: "var(--ae-blue)",
  },
  {
    brand: "Apple",
    name: "Spring Settle",
    bezier: [0.2, 0.9, 0.3, 1.2],
    description: "A slight overshoot that gives Apple animations their 'alive' feeling. Used in app launches and icon bounces.",
    usage: "App launch, icon bounce, pull-to-refresh",
    color: "var(--ae-blue)",
  },
  {
    brand: "Google Material",
    name: "Standard Easing",
    bezier: [0.4, 0.0, 0.2, 1],
    description: "Google Material Design's primary curve. Fast departure, gradual arrival. Makes interfaces feel responsive and natural.",
    usage: "FAB expansion, card lifts, navigation transitions",
    color: "var(--ae-green)",
  },
  {
    brand: "Google Material",
    name: "Decelerate",
    bezier: [0.0, 0.0, 0.2, 1],
    description: "For elements entering the screen. Arrives quickly, settles gently. The most-used Material curve for entrances.",
    usage: "Element entrances, dialog openings, snackbar slide-in",
    color: "var(--ae-green)",
  },
  {
    brand: "Google Material",
    name: "Accelerate",
    bezier: [0.4, 0.0, 1, 1],
    description: "For elements leaving the screen. Starts slow, exits fast. Creates a sense of departure and finality.",
    usage: "Element exits, dialog dismissal, toast removal",
    color: "var(--ae-green)",
  },
  {
    brand: "Nike",
    name: "Snappy Power",
    bezier: [0.5, 0.0, 0.1, 1],
    description: "Nike's motion is athletic — explosive starts with smooth landings. Minimal ease-in, strong ease-out. Feels dynamic and energetic.",
    usage: "Hero transitions, product reveals, scroll-triggered entrances",
    color: "var(--ae-orange)",
  },
  {
    brand: "Nike",
    name: "Impact",
    bezier: [0.7, 0.0, 0.15, 1],
    description: "Even more aggressive. Almost instant acceleration followed by a long, controlled deceleration. Used for high-impact reveals.",
    usage: "Campaign reveals, full-screen takeovers, video transitions",
    color: "var(--ae-orange)",
  },
  {
    brand: "Stripe",
    name: "Smooth Flow",
    bezier: [0.36, 0.66, 0.04, 1],
    description: "Stripe's motion is buttery and effortless. A distinctive curve that feels both technical and elegant — matching their brand perfectly.",
    usage: "Dashboard transitions, card animations, gradient morphs",
    color: "var(--ae-purple)",
  },
  {
    brand: "Figma",
    name: "Gentle Ease",
    bezier: [0.3, 0.0, 0.0, 1],
    description: "Figma uses a very fast ease-out with minimal ease-in. Makes the canvas feel instantly responsive to interactions.",
    usage: "Panel slides, object transforms, toolbar transitions",
    color: "var(--ae-red)",
  },
  {
    brand: "Framer",
    name: "Bounce",
    bezier: [0.175, 0.885, 0.32, 1.275],
    description: "Framer's playful overshoot — goes past the target and bounces back. Adds energy and personality to interactions.",
    usage: "Button feedback, card interactions, playful reveals",
    color: "var(--ae-yellow)",
  },
];

const BrandCurves = () => {
  const [selected, setSelected] = useState<BrandCurve>(BRAND_CURVES[0]);
  const brands = [...new Set(BRAND_CURVES.map(c => c.brand))];

  return (
    <div className="space-y-4">
      <div className="ae-panel-header rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="ae-label">Brand Motion Libraries</span>
        </div>
      </div>

      {/* Brand filter pills */}
      <div className="flex flex-wrap gap-1.5 px-1">
        {brands.map((brand) => {
          const isActive = selected.brand === brand;
          return (
            <button
              key={brand}
              onClick={() => setSelected(BRAND_CURVES.find(c => c.brand === brand)!)}
              className={`rounded-full px-3 py-1 ae-mono text-[10px] border transition-all ${
                isActive
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {brand}
            </button>
          );
        })}
      </div>

      {/* Curve list for selected brand */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-hide">
        {BRAND_CURVES.filter(c => c.brand === selected.brand).map((curve) => {
          const isActive = selected === curve;
          return (
            <button
              key={`${curve.brand}-${curve.name}`}
              onClick={() => setSelected(curve)}
              className={`flex-shrink-0 rounded px-2.5 py-1.5 ae-mono text-[9px] border transition-all ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {curve.name}
            </button>
          );
        })}
      </div>

      {/* Selected curve preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selected.brand}-${selected.name}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <InteractiveBezierGraph
            bezier={selected.bezier}
            width={320}
            height={220}
            interactive={false}
            showSpeed={true}
            label={`${selected.brand} — ${selected.name}`}
            color={selected.color}
          />

          <div className="mt-2 ae-panel p-3 space-y-2">
            <p className="text-[11px] leading-relaxed text-foreground/80">{selected.description}</p>
            <div className="flex items-start gap-2 pt-1 border-t border-border">
              <span className="ae-mono text-[9px] text-muted-foreground shrink-0 mt-0.5">USED FOR:</span>
              <p className="text-[10px] text-foreground/60">{selected.usage}</p>
            </div>
            <div className="pt-1 border-t border-border">
              <span className="ae-mono text-[10px]" style={{ color: `hsl(${selected.color})` }}>
                cubic-bezier({selected.bezier.join(", ")})
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BrandCurves;
