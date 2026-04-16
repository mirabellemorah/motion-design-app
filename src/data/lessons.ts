export interface CurvePreset {
  label: string;
  bezier: [number, number, number, number];
}

export type LessonTrack = "motion" | "principles";

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  chapter: number;
  track: LessonTrack;
  description: string;
  theory: string[];
  aeContext: string;
  defaultBezier: [number, number, number, number];
  targetBezier?: [number, number, number, number];
  tip: string;
  keyPrinciples: string[];
}

export interface AnimationParams {
  duration: number;
  easing: string;
  delay: number;
  bounce?: number;
  stiffness?: number;
  bezier?: [number, number, number, number];
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  practiceAttempts: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  gems: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export const COMMON_PRESETS: CurvePreset[] = [
  { label: "Linear", bezier: [0, 0, 1, 1] },
  { label: "Ease", bezier: [0.25, 0.1, 0.25, 1] },
  { label: "Ease In", bezier: [0.42, 0, 1, 1] },
  { label: "Ease Out", bezier: [0, 0, 0.58, 1] },
  { label: "Ease In Out", bezier: [0.42, 0, 0.58, 1] },
  { label: "AE Default", bezier: [0.33, 0, 0.67, 1] },
  { label: "Snappy", bezier: [0.5, 0, 0.1, 1] },
  { label: "Overshoot", bezier: [0.175, 0.885, 0.32, 1.275] },
];

export const EASING_OPTIONS = COMMON_PRESETS.map(p => ({
  label: p.label,
  value: p.label.toLowerCase().replace(/\s+/g, ''),
}));

export const lessons: Lesson[] = [
  {
    id: "what-is-a-graph",
    title: "What Is the Graph Editor?",
    subtitle: "Your most powerful animation tool",
    chapter: 1,
    description: "The Graph Editor is where professional animators spend 80% of their time. It's the difference between amateur and professional motion.",
    theory: [
      "In After Effects, every animated property has a graph behind it.",
      "The graph shows how a value changes over time — the X axis is time, the Y axis is the property value.",
      "By default, AE uses 'linear' interpolation: a straight line from A to B. This looks robotic.",
      "The Graph Editor lets you shape HOW the animation moves between keyframes using bezier curves.",
    ],
    aeContext: "Select a keyframed property → press the Graph Editor button in the Timeline panel (or Shift+F3).",
    defaultBezier: [0, 0, 1, 1],
    tip: "The graph is where amateur animations become professional ones. Learn to read it and you'll never animate blindly again.",
    keyPrinciples: [
      "The steeper the curve, the faster the motion at that point",
      "A flat curve means the object is stationary or barely moving",
      "The shape of the curve IS the feel of your animation",
    ],
  },
  {
    id: "value-graph-basics",
    title: "Reading the Value Graph",
    subtitle: "Understand position over time",
    chapter: 1,
    description: "The Value Graph shows the actual property value at each point in time. When you see the curve go up, the value increases. When it flattens, the object slows down.",
    theory: [
      "The Value Graph plots the actual value of a property (e.g., X position) against time.",
      "A straight diagonal line = constant speed (linear interpolation).",
      "A curve that's steep at the start and flat at the end = fast start, slow stop (ease out).",
      "A curve that's flat at the start and steep at the end = slow start, fast finish (ease in).",
    ],
    aeContext: "In the Graph Editor, click the 'Show Value Graph' button (looks like a simple curve icon).",
    defaultBezier: [0, 0, 0.58, 1],
    tip: "Think of the Value Graph like a position map. The Y-axis IS where your object is at any given moment in time.",
    keyPrinciples: [
      "Steep = fast movement, Flat = slow or stopped",
      "The slope at any point = the speed at that moment",
      "S-curves mean the object accelerates then decelerates",
    ],
  },
  {
    id: "speed-graph-basics",
    title: "Reading the Speed Graph",
    subtitle: "Understand velocity over time",
    chapter: 1,
    description: "The Speed Graph shows how fast a property is changing at each moment. A peak means maximum velocity. Zero means the object is stopped.",
    theory: [
      "The Speed Graph shows velocity (rate of change) — not position.",
      "A flat line at the top = constant high speed. A flat line at zero = object is stopped.",
      "A curve that starts at zero and rises = the object is accelerating (ease in).",
      "A curve that starts high and drops to zero = the object is decelerating (ease out).",
    ],
    aeContext: "In the Graph Editor, click 'Show Speed Graph' (looks like a mountain/bell curve icon).",
    defaultBezier: [0.42, 0, 0.58, 1],
    tip: "The Speed Graph is the derivative of the Value Graph. When the Value Graph is steep, the Speed Graph is high.",
    keyPrinciples: [
      "High point = fastest motion, Zero = completely stopped",
      "Bell curve shape = classic ease in-out (accelerate then decelerate)",
      "Flat top = constant speed section (like linear)",
    ],
  },
  {
    id: "ease-in",
    title: "Ease In: Slow Start",
    subtitle: "Objects that accelerate from rest",
    chapter: 2,
    description: "Ease In starts slow and finishes fast. Use it for objects leaving the screen or falling under gravity. The curve is flat at the start (slow) and steep at the end (fast).",
    theory: [
      "Ease In mimics objects overcoming inertia — they start slow and accelerate.",
      "On the Value Graph: flat start, steep end.",
      "On the Speed Graph: starts at zero, rises to maximum at the end.",
      "In CSS: cubic-bezier(0.42, 0, 1, 1). In AE: pull the first keyframe's handle to the right.",
    ],
    aeContext: "Select keyframes → Right-click → Keyframe Interpolation → Temporal: Bezier. Then drag the first handle right.",
    defaultBezier: [0.42, 0, 1, 1],
    targetBezier: [0.55, 0, 1, 1],
    tip: "Use Ease In for exits. When something leaves the screen, it should accelerate away — like throwing a ball.",
    keyPrinciples: [
      "Best for: elements leaving the viewport, objects falling, throwing",
      "The handle on the FIRST keyframe controls the ease-in amount",
      "More extreme = slower start, more dramatic acceleration",
    ],
  },
  {
    id: "ease-out",
    title: "Ease Out: Slow End",
    subtitle: "Objects that decelerate to rest",
    chapter: 2,
    description: "Ease Out starts fast and finishes slow. This is the MOST important easing for UI animation. Use it for anything appearing or arriving on screen.",
    theory: [
      "Ease Out mimics objects coming to rest — they arrive fast and gently decelerate.",
      "On the Value Graph: steep start, flat end.",
      "On the Speed Graph: starts at maximum, drops to zero.",
      "In CSS: cubic-bezier(0, 0, 0.58, 1). In AE: pull the second keyframe's handle to the left.",
    ],
    aeContext: "Select the LAST keyframe → drag its bezier handle to the LEFT to control how gradually it stops.",
    defaultBezier: [0, 0, 0.58, 1],
    targetBezier: [0.05, 0.5, 0.2, 1],
    tip: "Google Material Design uses ease-out for almost all entrances. It feels responsive because the element arrives quickly, then settles.",
    keyPrinciples: [
      "Best for: elements entering the screen, objects landing, UI responses",
      "The handle on the LAST keyframe controls the ease-out amount",
      "This is the #1 easing curve for UI designers to master",
    ],
  },
  {
    id: "ease-in-out",
    title: "Ease In-Out: The S-Curve",
    subtitle: "Smooth acceleration and deceleration",
    chapter: 2,
    description: "Ease In-Out combines both: slow start, fast middle, slow end. It's the most natural-feeling motion and the default in most professional animation.",
    theory: [
      "Ease In-Out creates an S-shaped curve on the Value Graph.",
      "Speed Graph shows a bell curve: zero → peak → zero.",
      "Most physical objects move this way — they accelerate, reach peak speed, then decelerate.",
      "The handles on BOTH keyframes are pulled inward, creating symmetrical or asymmetrical easing.",
    ],
    aeContext: "Select both keyframes → F9 (Easy Ease). Then customize the handles for asymmetric timing.",
    defaultBezier: [0.42, 0, 0.58, 1],
    targetBezier: [0.65, 0, 0.35, 1],
    tip: "F9 in After Effects applies 'Easy Ease' — a gentle ease in-out. But the best animators always customize the handles further.",
    keyPrinciples: [
      "F9 (Easy Ease) is just the starting point — always refine",
      "Asymmetric ease-in-out often feels better than symmetric",
      "Pull handles further apart for more dramatic easing",
    ],
  },
  {
    id: "overshoot",
    title: "Overshoot & Settle",
    subtitle: "Going past the target and bouncing back",
    chapter: 3,
    description: "Overshoot means the value goes BEYOND the final position, then settles back. On the graph, the curve goes above the endpoint. This adds energy and life.",
    theory: [
      "On the Value Graph, overshoot means the curve exceeds the final value then returns.",
      "This is achieved by pulling the second control point ABOVE the end value (Y > 1).",
      "The Speed Graph shows the velocity going negative briefly as it bounces back.",
      "Amount of overshoot = how far past the target the value goes.",
    ],
    aeContext: "Drag the last keyframe's bezier handle upward (above the value line). The further up, the more overshoot.",
    defaultBezier: [0.175, 0.885, 0.32, 1.275],
    targetBezier: [0.2, 0.9, 0.3, 1.4],
    tip: "A tiny overshoot (1.05-1.1) adds life to UI. Too much (>1.3) feels cartoonish. Find the sweet spot for your brand.",
    keyPrinciples: [
      "Y values above 1.0 mean the property overshoots its final value",
      "Creates a sense of physical momentum and elasticity",
      "Subtle overshoot is used by Apple, Google, and Nike in their motion systems",
    ],
  },
  {
    id: "custom-curves",
    title: "Crafting Custom Curves",
    subtitle: "Developing your motion signature",
    chapter: 3,
    description: "Professional motion designers develop signature curves. Nike's motion is snappy with short ease-in and long ease-out. Apple's is smooth and controlled. Learn to craft your own.",
    theory: [
      "Every brand has a motion personality expressed through their curves.",
      "Nike: aggressive ease-out with minimal ease-in → snappy, energetic.",
      "Apple: smooth ease-in-out with slight overshoot → refined, premium.",
      "Google: ease-out focused, 300ms standard → responsive, efficient.",
    ],
    aeContext: "Study the Graph Editor curves of animations you admire. Screenshot them. Recreate them. Build a library of go-to curves.",
    defaultBezier: [0.25, 0.1, 0.25, 1],
    targetBezier: [0.5, 0, 0.1, 1],
    tip: "Save your best curves as Animation Presets in AE (Animation → Save Animation Preset). Build a personal library over time.",
    keyPrinciples: [
      "Your curve library is your motion design toolkit",
      "Different contexts need different curves — buttons vs page transitions vs reveals",
      "Study cubic-bezier.com to test curves in real-time alongside your AE work",
    ],
  },
];

export const initialStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  gems: 0,
  lessonsCompleted: 0,
  totalLessons: lessons.length,
};
