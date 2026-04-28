import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BookOpen,
  Target,
  Hash,
  Clock,
  Ruler,
  Gauge,
  BarChart3,
  Film,
  type LucideIcon,
} from "lucide-react";

interface Section {
  title: string;
  Icon: LucideIcon;
  content: string[];
  technicalNote?: string;
}

const SECTIONS: Section[] = [
  {
    title: "What IS a Cubic Bezier?",
    Icon: Target,
    content: [
      "Imagine you're drawing a line from point A to point B. A straight line goes at the exact same speed the whole time — like a robot walking. Boring!",
      "A cubic bezier is a MAGIC line that can curve. Instead of going straight, it bends and swoops. This is how we make animations feel alive — like a ball bouncing, or a door swinging open.",
      "The word 'cubic' just means it uses a math formula with 3 as the highest power. The word 'bezier' comes from Pierre Bézier, a French engineer who invented this type of curve. Don't worry about the math — just think of it as a bendy line!",
      "In After Effects, EVERY animation uses a bezier curve behind the scenes. When you press F9 (Easy Ease), you're actually reshaping this bezier curve.",
    ],
    technicalNote: "A cubic bezier is a parametric curve defined by four points: P0 (start), P1 (control 1), P2 (control 2), P3 (end). The curve is computed using the formula B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3 where t goes from 0 to 1.",
  },
  {
    title: "The Four Numbers Explained",
    Icon: Hash,
    content: [
      "When you see something like cubic-bezier(0.25, 0.1, 0.25, 1.0), those four numbers are coordinates for two 'handles' — like little joysticks that control how the curve bends.",
      "The FIRST two numbers (0.25, 0.1) are the position of Handle 1. This handle controls HOW the animation STARTS. Think of it like grabbing the beginning of a rubber band and pulling it.",
      "The LAST two numbers (0.25, 1.0) are the position of Handle 2. This handle controls HOW the animation ENDS. It's like holding the end of that rubber band.",
      "Each number goes from 0 to 1 (with some exceptions). The first number in each pair is the TIME position (left to right). The second number is the VALUE position (bottom to top).",
      "So (0.25, 0.1) means: 'At 25% across the timeline, pull the handle to only 10% of the value.' This creates a slow start because the curve stays low at first.",
    ],
    technicalNote: "The four values represent x1, y1, x2, y2 — the coordinates of the two control points P1 and P2. P0 is always (0,0) and P3 is always (1,1). X values must be between 0 and 1 (time can't go backwards), but Y values can exceed 0-1 range to create overshoot effects.",
  },
  {
    title: "What Does the X-Axis (Time) Mean?",
    Icon: Clock,
    content: [
      "The bottom of the graph (going left to right) is TIME. Imagine it like a clock ticking from the start of your animation to the end.",
      "The left side is the very beginning — time = 0. This is the exact moment your animation starts. Like when you press 'play' on a video.",
      "The right side is the very end — time = 1 (or 100%). This is when your animation is completely finished.",
      "The middle is halfway through. If your animation takes 1 second total, the middle of the graph is at 0.5 seconds.",
      "Important: the TIME axis doesn't care how many seconds your animation takes. Whether it's 0.2 seconds or 3 seconds, the graph always shows 0% to 100% of that time.",
    ],
    technicalNote: "The X-axis represents normalized time (0 to 1). The actual duration is set separately (e.g., transition: 0.3s). The bezier curve maps this normalized time to a normalized progress value. This is why the same curve can be reused at different durations.",
  },
  {
    title: "What Does the Y-Axis (Value) Mean?",
    Icon: Ruler,
    content: [
      "The side of the graph (going bottom to top) is the VALUE — how far your animation has progressed.",
      "The bottom (0%) means: 'I haven't moved at all yet.' If you're moving a box from left to right, bottom means the box is still at the starting position.",
      "The top (100%) means: 'I'm at my final destination.' The box has arrived where it needs to be.",
      "50% means halfway there. The box is in the middle of its journey.",
      "Here's the fun part: the value CAN go above 100%! This creates an 'overshoot' — the box goes PAST its target and then comes back. Like when you slide into a seat and scoot too far, then adjust back.",
      "Values below 0% mean the animation briefly goes BACKWARDS before heading forward. Like winding up before a throw!",
    ],
    technicalNote: "The Y-axis represents the interpolated output value. When Y > 1.0, the property overshoots its target value. When Y < 0.0, it goes below the initial value (anticipation). In After Effects, this is visualized in the Value Graph where Y represents the actual property value (position, scale, etc.).",
  },
  {
    title: "The Slope = Speed",
    Icon: Gauge,
    content: [
      "Here's the SECRET that separates beginners from pros: the steepness of the curve tells you the SPEED.",
      "If the curve is going UP steeply (like a cliff), the animation is moving FAST at that moment. Things are happening quickly!",
      "If the curve is nearly flat (like a table), the animation is barely moving. It's slow, gentle, almost paused.",
      "A straight diagonal line (corner to corner) means constant speed — no speeding up, no slowing down. This is 'linear' easing and it looks robotic.",
      "The best animations have curves that are STEEP in some places and FLAT in others. This creates contrast — fast moments and slow moments — which makes motion feel alive and natural.",
    ],
    technicalNote: "The first derivative of the value curve gives you the Speed Graph. Slope = velocity. A steep slope means high velocity; a flat slope means near-zero velocity. In AE's Speed Graph, peaks represent maximum velocity and valleys represent minimum velocity. The area under the speed graph equals the total displacement.",
  },
  {
    title: "The Speed Graph Explained",
    Icon: BarChart3,
    content: [
      "The Value Graph shows WHERE something is. The Speed Graph shows HOW FAST it's going. They're two ways of looking at the same animation!",
      "Imagine watching a car. The Value Graph is like a GPS map showing the car's position. The Speed Graph is like the speedometer showing how fast the car is driving.",
      "When the Speed Graph is high (near the top), the object is zooming fast. When it's low (near the bottom), the object is crawling or stopped.",
      "A Speed Graph shaped like a mountain (bell curve) means: start slow, go fast in the middle, end slow. This is the classic 'ease in-out.'",
      "A Speed Graph that starts high and drops to zero means: start fast, gradually stop. This is 'ease out' — the most important curve for UI design because it makes things feel responsive.",
    ],
    technicalNote: "The Speed Graph is the absolute value of the first derivative (dy/dx) of the Value Graph. Mathematically: speed(t) = |d/dt[B(t)]|. In After Effects, you can toggle between Value Graph and Speed Graph views. The Speed Graph is particularly useful for identifying where motion peaks and identifying jarring velocity changes.",
  },
  {
    title: "What Do Seconds & Frames Mean?",
    Icon: Film,
    content: [
      "Animations happen over time. We measure that time in SECONDS (like 0.3s) or FRAMES (like 7f at 24fps).",
      "In film and After Effects, there are usually 24 frames per second (fps). That means 24 tiny pictures flash by every second to create the illusion of movement.",
      "A 1-second animation = 24 frames. A 0.5-second animation = 12 frames. A very quick 0.3-second animation = about 7 frames.",
      "For UI/web, we usually think in milliseconds: 300ms (fast snap), 500ms (comfortable transition), 1000ms (one full second, usually too slow for UI).",
      "PRO TIP: Most UI animations should be between 200ms and 500ms. Anything shorter feels instant. Anything longer feels sluggish. The sweet spot for most interactions is 250–350ms.",
    ],
    technicalNote: "After Effects typically works at 24fps (film), 25fps (PAL), or 30fps (NTSC/web). CSS/JS animations use milliseconds. Frame-accurate timing: frames = duration_seconds × fps. For 300ms at 24fps = 7.2 frames ≈ 7 frames. At 60fps (screen refresh), 300ms = 18 frames of rendering.",
  },
];

const BezierTheoryExplainer = () => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      <div className="px-4 py-2.5 soft-card-muted rounded-xl mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="ae-label text-foreground">Complete Beginner's Guide</span>
        </div>
      </div>

      {SECTIONS.map((section, i) => {
        const isOpen = openSection === i;
        return (
          <motion.div
            key={i}
            className="soft-card overflow-hidden"
            initial={false}
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/30 transition-colors"
            >
              <section.Icon className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground">{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    {section.content.map((paragraph, pi) => (
                      <p key={pi} className="text-xs leading-relaxed text-foreground/70">
                        {paragraph}
                      </p>
                    ))}

                    {section.technicalNote && (
                      <div className="mt-3 ae-panel p-3 rounded-lg">
                        <p className="text-[10px] font-semibold mb-1" style={{ color: "hsl(var(--ae-blue))" }}>
                          TECHNICAL NOTE
                        </p>
                        <p className="text-[10px] leading-relaxed" style={{ color: "hsl(var(--ae-panel-fg) / 0.7)" }}>
                          {section.technicalNote}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BezierTheoryExplainer;
