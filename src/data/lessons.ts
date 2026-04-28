export interface CurvePreset {
  label: string;
  bezier: [number, number, number, number];
}

export type LessonTrack = "motion" | "principles" | "animation-principles";

export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

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
  /** Creative, hands-on practice (not curve-based). Used for animation-principles + principles. */
  creativePractice?: string;
  /** Optional MCQ to check understanding (used by principles). */
  quiz?: QuizQuestion;
  /** Demo type for principles track — drives interactive widget instead of bezier graph. */
  demo?:
    | "contrast"
    | "hierarchy"
    | "color-wheel"
    | "balance"
    | "proximity"
    | "alignment"
    | "repetition"
    | "typography";
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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
    track: "motion",
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

  // ============= PRINCIPLES OF DESIGN TRACK =============
  {
    id: "p-contrast",
    title: "Contrast",
    subtitle: "Making things stand out",
    chapter: 1,
    track: "principles",
    description: "Contrast is the difference between elements — light vs dark, big vs small, thick vs thin. It's how you guide the eye and create hierarchy.",
    theory: [
      "Contrast is the #1 tool for visual hierarchy. Without it, everything blends together.",
      "Types: tonal (light/dark), size (big/small), color (warm/cool), shape (round/angular), weight (bold/light).",
      "High contrast = bold, attention-grabbing, energetic. Low contrast = calm, refined, subtle.",
      "WCAG accessibility requires a 4.5:1 contrast ratio between body text and background.",
    ],
    aeContext: "Strong contrast in motion = a slow background with a fast hero element. The eye locks onto whatever moves differently.",
    defaultBezier: [0.4, 0, 0.2, 1],
    tip: "If everything is bold, nothing is bold. Reserve high contrast for what matters most.",
    keyPrinciples: [
      "Contrast creates hierarchy — what users see first, second, third",
      "Test in grayscale to check tonal contrast independently of color",
      "In motion: contrast in speed and direction draws the eye",
    ],
  },
  {
    id: "p-balance",
    title: "Balance",
    subtitle: "Visual weight and stability",
    chapter: 1,
    track: "principles",
    description: "Balance is how visual weight is distributed across a composition. It can be symmetrical (formal) or asymmetrical (dynamic).",
    theory: [
      "Every element has visual weight: size, color, density, and position all contribute.",
      "Symmetrical balance = mirrored sides → feels stable, traditional, authoritative.",
      "Asymmetrical balance = different elements counterweight each other → feels dynamic, modern.",
      "Radial balance = elements arranged around a center point → focused, hypnotic.",
    ],
    aeContext: "Animation can break balance momentarily and then restore it — that tension is what makes motion feel intentional.",
    defaultBezier: [0.5, 0, 0.5, 1],
    tip: "Squint at your design. If one side feels heavier, redistribute weight using size, color intensity, or whitespace.",
    keyPrinciples: [
      "Balance ≠ symmetry. Asymmetric layouts can be perfectly balanced",
      "Whitespace has visual weight too — empty space stabilizes busy areas",
      "Off-balance compositions feel unsettling on purpose (use sparingly)",
    ],
  },
  {
    id: "p-hierarchy",
    title: "Hierarchy",
    subtitle: "Guiding the eye in order",
    chapter: 1,
    track: "principles",
    description: "Hierarchy is the order in which elements are seen. Good hierarchy makes a design instantly scannable — users know where to look first.",
    theory: [
      "Hierarchy is built using size, color, contrast, position, and whitespace.",
      "The largest, boldest, brightest element is usually seen first. Use that for what matters most.",
      "Three-tier hierarchy is common: primary (headline), secondary (subhead), tertiary (body/meta).",
      "Position matters: top-left in Western reading order gets attention first.",
    ],
    aeContext: "In motion design, hierarchy = sequence. Animate the most important element FIRST, then supporting elements stagger in.",
    defaultBezier: [0.2, 0, 0.2, 1],
    tip: "Ask: 'If a user sees this for 1 second, what should they remember?' Make THAT the most prominent element.",
    keyPrinciples: [
      "No more than 3 levels of hierarchy at once — it gets confusing",
      "Use a type scale (e.g. 12, 14, 18, 24, 32, 48) to enforce consistent levels",
      "Stagger animations 40–80ms apart to reinforce visual hierarchy in motion",
    ],
  },
  {
    id: "p-repetition",
    title: "Repetition & Rhythm",
    subtitle: "Patterns that create unity",
    chapter: 2,
    track: "principles",
    description: "Repeating elements — colors, shapes, fonts, spacing — creates unity and rhythm. It's what makes a design feel like ONE thing instead of a pile of parts.",
    theory: [
      "Repetition builds visual systems. A repeated radius, color, or font ties pages together.",
      "Rhythm is repetition with variation — like a heartbeat or a song. Predictable but alive.",
      "Design systems are basically formalized repetition: same button, same spacing scale, same colors everywhere.",
      "Rhythm in layout: equal spacing creates calm; varied spacing creates energy.",
    ],
    aeContext: "In motion, repeated easing curves across an experience create a brand 'feel'. Mixing curves randomly feels chaotic.",
    defaultBezier: [0.4, 0, 0.2, 1],
    tip: "Pick 2-3 easing curves and use them across your entire product. That consistency IS your motion brand.",
    keyPrinciples: [
      "Repeated visual elements signal 'these things belong together'",
      "Break repetition deliberately to highlight something special",
      "Consistent spacing (8pt grid) is the most underrated form of repetition",
    ],
  },
  {
    id: "p-alignment",
    title: "Alignment",
    subtitle: "Invisible lines that organize",
    chapter: 2,
    track: "principles",
    description: "Alignment creates invisible lines that connect elements. Strong alignment makes a design feel intentional and polished. Weak alignment makes it feel sloppy.",
    theory: [
      "Every element should be visually connected to at least one other element via alignment.",
      "Edge alignment (left, right, top, bottom) is strongest. Center alignment is weaker but more formal.",
      "Optical alignment > mathematical alignment: sometimes you need to nudge things 1px to LOOK aligned.",
      "Grids enforce alignment at scale — 12-column grids are the web standard.",
    ],
    aeContext: "When animating, elements should travel along aligned paths. Random trajectories feel chaotic; aligned ones feel composed.",
    defaultBezier: [0.4, 0, 0.6, 1],
    tip: "Hold cmd/ctrl and drag a guideline across your design. Every important element should snap to one of those lines.",
    keyPrinciples: [
      "Pick ONE alignment per text block (don't mix center and left)",
      "Use a baseline grid for vertical rhythm in long-form content",
      "Optical adjustments (icons, italics) often need manual alignment tweaks",
    ],
  },
  {
    id: "p-proximity",
    title: "Proximity",
    subtitle: "Things that belong together, group together",
    chapter: 2,
    track: "principles",
    description: "Elements close together are perceived as related. Elements far apart are perceived as separate. This is one of the oldest laws of visual perception (Gestalt).",
    theory: [
      "Proximity is THE fastest way to communicate grouping — faster than borders, colors, or labels.",
      "A single label with two values: place the label closer to the value it describes.",
      "White space BETWEEN groups should be larger than white space WITHIN a group.",
      "Misuse: cramming unrelated items together creates confusion and visual noise.",
    ],
    aeContext: "Group related elements into a single null/parent in AE. Animate the parent — children move together, reinforcing their relationship.",
    defaultBezier: [0.3, 0, 0.3, 1],
    tip: "Rule of thumb: spacing within a group should be HALF the spacing between groups. e.g. 8px inside, 16px between.",
    keyPrinciples: [
      "Whitespace IS a design element, not empty space to fill",
      "Proximity overrides color and shape in signaling relationships",
      "When animating groups, move them together — separate motion breaks the perceived group",
    ],
  },
  {
    id: "p-color-theory",
    title: "Color Theory",
    subtitle: "How color creates feeling and meaning",
    chapter: 3,
    track: "principles",
    description: "Color does more than decorate — it sets mood, signals meaning, and drives action. Understanding the color wheel gives you a system for picking palettes that work.",
    theory: [
      "Color models: HSL (hue, saturation, lightness) is the most designer-friendly. Hue = the color, saturation = intensity, lightness = brightness.",
      "Complementary colors (opposite on the wheel) create maximum contrast — energetic, attention-grabbing.",
      "Analogous colors (next to each other) feel harmonious and calm.",
      "60-30-10 rule: 60% dominant color, 30% secondary, 10% accent. A simple way to balance any palette.",
    ],
    aeContext: "Color shifts during motion (e.g. a button changing from primary to success on click) reinforce state changes powerfully.",
    defaultBezier: [0.4, 0, 0.2, 1],
    tip: "Start with one base color. Generate tints (add white) and shades (add black). You now have a full system from one decision.",
    keyPrinciples: [
      "Saturated colors = energy, urgency. Desaturated = calm, premium",
      "Cultural meaning matters: red = danger in West, luck in East",
      "Always test in dark mode — colors that pop on white can vibrate on black",
    ],
  },
  {
    id: "p-typography",
    title: "Typography",
    subtitle: "The voice of your design",
    chapter: 3,
    track: "principles",
    description: "Typography is 95% of design. The fonts you choose, how big, how spaced — they carry tone, hierarchy, and brand. Master type and you master design.",
    theory: [
      "Two main categories: serif (formal, traditional, editorial) and sans-serif (modern, clean, digital).",
      "Type scale: use a modular ratio (1.25x, 1.333x, 1.5x) to size headings consistently across your design.",
      "Line-height: 1.4-1.6x for body text. Tighter (1.0-1.2) for large display headings.",
      "Line length: 50-75 characters per line is optimal for reading. Longer = exhausting.",
    ],
    aeContext: "Animated type (kinetic typography) follows the same principles — contrast in size, weight, and timing creates rhythm and emphasis.",
    defaultBezier: [0.2, 0, 0.2, 1],
    tip: "Limit yourself to TWO typefaces max — one for headings, one for body. Use weight (light, regular, bold) for variety instead of more fonts.",
    keyPrinciples: [
      "Letter-spacing: tighten large headings, loosen small caps",
      "Use real text (not Lorem Ipsum) when designing — typography problems hide behind fake content",
      "Animate text in word-by-word or line-by-line, never letter-by-letter (unreadable)",
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
