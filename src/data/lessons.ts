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
    demo: "contrast",
    quiz: {
      q: "Which pairing has the STRONGEST visual contrast?",
      options: ["Light gray text on white", "Black text on white", "Dark gray text on medium gray"],
      correctIndex: 1,
      explanation: "Maximum tonal difference (pure black on pure white) creates the strongest contrast.",
    },
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
    demo: "balance",
    quiz: {
      q: "Which is true about asymmetrical balance?",
      options: [
        "It can never feel stable",
        "Different elements with equal visual weight create balance without mirroring",
        "It requires identical elements on each side",
      ],
      correctIndex: 1,
    },
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
    demo: "hierarchy",
    quiz: {
      q: "What is the FASTEST way to establish hierarchy?",
      options: ["Adding more colors", "Size and weight contrast", "Adding borders to everything"],
      correctIndex: 1,
    },
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
    demo: "repetition",
    quiz: {
      q: "Why use a consistent spacing scale (e.g. 8pt grid)?",
      options: [
        "It limits creativity",
        "It creates rhythm and visual unity across the design",
        "It makes designs look identical",
      ],
      correctIndex: 1,
    },
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
    demo: "alignment",
    quiz: {
      q: "Which alignment is generally STRONGEST for body content?",
      options: ["Center alignment", "Edge alignment (left or right)", "Random alignment"],
      correctIndex: 1,
    },
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
    demo: "proximity",
    quiz: {
      q: "If a label belongs to a value, the label should be:",
      options: [
        "Equally spaced from all values",
        "Closer to its value than to other elements",
        "Far from the value to give it room",
      ],
      correctIndex: 1,
    },
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
    demo: "color-wheel",
    quiz: {
      q: "Two colors directly opposite on the color wheel are called:",
      options: ["Analogous", "Complementary", "Triadic"],
      correctIndex: 1,
    },
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
    demo: "typography",
    quiz: {
      q: "What is the optimal line length for body reading?",
      options: ["20–30 characters", "50–75 characters", "120+ characters"],
      correctIndex: 1,
    },
  },

  // ============= 12 PRINCIPLES OF ANIMATION (Disney) =============
  {
    id: "ap-squash-stretch",
    title: "Squash and Stretch",
    subtitle: "Weight, mass, and elasticity",
    chapter: 1,
    track: "animation-principles",
    description: "Squash and stretch gives objects the illusion of weight and flexibility. A bouncing ball flattens on impact and stretches as it falls — that deformation is what sells the physics.",
    theory: [
      "Volume must be preserved: as an object stretches in one axis, it contracts in the other.",
      "Soft objects (rubber ball) deform a lot. Hard objects (bowling ball) deform very little.",
      "Even rigid UI elements benefit from a tiny squash on landing — it sells the impact.",
    ],
    aeContext: "In motion design: a button press that briefly squashes vertically + stretches horizontally feels tactile and alive.",
    defaultBezier: [0.34, 1.56, 0.64, 1],
    tip: "More squash = more cartoony. Less squash = more grounded. Match the amount to your brand's tone.",
    keyPrinciples: [
      "Always preserve volume",
      "Stretch on the way to impact, squash on contact",
      "Even subtle deformation reads as weight",
    ],
    creativePractice: "Find a 5-second video of a bouncing ball. Pause and sketch 3 key frames by hand: pre-impact stretch, contact squash, and rebound stretch. Note where volume is preserved.",
  },
  {
    id: "ap-anticipation",
    title: "Anticipation",
    subtitle: "Prepare the audience for the action",
    chapter: 1,
    track: "animation-principles",
    description: "Anticipation is the wind-up before the pitch — a small opposite movement that signals what's about to happen. Without it, actions feel sudden and unreadable.",
    theory: [
      "Before any major action, an opposite micro-movement primes the viewer.",
      "A character about to jump up first crouches down. A door about to slam first pulls back slightly.",
      "In UI: a button that scales DOWN briefly before scaling UP on tap feels intentional, not glitchy.",
    ],
    aeContext: "Add 4–8 frames of opposite motion before any major movement to dramatically improve readability.",
    defaultBezier: [0.5, -0.5, 0.5, 1.5],
    tip: "If your animation feels 'sudden', you're missing anticipation. Add 3-6 frames of preparation.",
    keyPrinciples: [
      "Action without anticipation feels random",
      "The bigger the action, the bigger the anticipation",
      "Anticipation builds momentum AND audience expectation",
    ],
    creativePractice: "Storyboard a 3-second scene where a character or object jumps. Sketch 4 panels: rest, anticipation (crouch), action (jump), and follow-through. Focus on the anticipation pose.",
  },
  {
    id: "ap-staging",
    title: "Staging",
    subtitle: "Direct the audience's attention",
    chapter: 1,
    track: "animation-principles",
    description: "Staging is the art of presenting an idea so it's unmistakably clear. Pose, framing, lighting, and timing all combine to focus the eye on what matters.",
    theory: [
      "Silhouette test: if your pose reads as a black silhouette, the action is clear.",
      "Avoid two important actions happening at the same time — split them temporally.",
      "Camera framing and negative space focus attention as much as the subject itself.",
    ],
    aeContext: "Don't animate everything at once. Stage the hero element, let it land, then bring in supporting elements.",
    defaultBezier: [0.4, 0, 0.2, 1],
    tip: "If the viewer doesn't know where to look, your staging has failed. Simplify.",
    keyPrinciples: [
      "Silhouettes communicate faster than detail",
      "One idea at a time",
      "Negative space is a directing tool",
    ],
    creativePractice: "Pick your favorite movie poster. Trace the silhouette of the main subject. Notice what details are dropped to keep the read clear, then redraw your own staging concept for a 'hero opening' shot.",
  },
  {
    id: "ap-straight-pose",
    title: "Straight Ahead vs Pose to Pose",
    subtitle: "Two ways to plan motion",
    chapter: 2,
    track: "animation-principles",
    description: "Straight ahead = draw frame by frame, discovering as you go. Pose to pose = plan key poses first, then fill in. Each has trade-offs; pros use both.",
    theory: [
      "Straight ahead: spontaneous, fluid, great for fire/water/chaos. Risks losing scale and timing.",
      "Pose to pose: structured, predictable, great for character acting and timing-critical work.",
      "Hybrid is most common: plan key poses, then animate fluid sections straight ahead.",
    ],
    aeContext: "In AE, keyframes ARE pose-to-pose. Sketching 'in-between' graphic frames in Photoshop is straight ahead.",
    defaultBezier: [0.4, 0, 0.6, 1],
    tip: "Plan with poses. Discover with straight ahead. Combine both.",
    keyPrinciples: [
      "Pose to pose gives control",
      "Straight ahead gives life",
      "Most pro work is hybrid",
    ],
    creativePractice: "On paper, animate a small flag in the wind two ways: (1) straight-ahead — draw 12 frames sequentially; (2) pose to pose — draw 3 key poses first, then in-betweens. Compare which feels more alive.",
  },
  {
    id: "ap-follow-through",
    title: "Follow Through & Overlapping Action",
    subtitle: "Different parts arrive at different times",
    chapter: 2,
    track: "animation-principles",
    description: "When a body stops, its loose parts (hair, coat, antenna) keep going. When a body moves, different parts lead and trail. This is what makes motion feel organic.",
    theory: [
      "Follow through: secondary parts continue past the stopping point and settle.",
      "Overlapping action: different parts of a body or layered elements move on slightly different timing.",
      "In UI: cards that stagger by 40-80ms feel alive; cards that move in sync feel mechanical.",
    ],
    aeContext: "Offset the timing of layered elements by a few frames. Add a 10-15% overshoot on dangling parts.",
    defaultBezier: [0.34, 1.2, 0.64, 1],
    tip: "If everything starts and stops together, your scene feels stiff. Offset the secondary parts.",
    keyPrinciples: [
      "Loose parts trail the body",
      "Stagger creates life",
      "Overshoot then settle = organic stop",
    ],
    creativePractice: "Take a scarf or piece of cloth. Whip it through the air and stop suddenly. Watch the trailing motion. Sketch 5 frames showing how the cloth follows through after your hand stops.",
  },
  {
    id: "ap-slow-in-out",
    title: "Slow In and Slow Out",
    subtitle: "The most fundamental ease",
    chapter: 2,
    track: "animation-principles",
    description: "Real objects rarely start or stop at full speed — they accelerate from rest and decelerate to a stop. This is the foundation of every easing curve in motion design.",
    theory: [
      "Animation feels lifelike when there are MORE drawings near the start and end of an action and FEWER in the middle.",
      "Linear motion is the giveaway of amateur animation.",
      "This is exactly what bezier curves model — slow in, fast middle, slow out.",
    ],
    aeContext: "F9 (Easy Ease) in After Effects is your starting point. Then refine in the Graph Editor.",
    defaultBezier: [0.42, 0, 0.58, 1],
    tip: "If in doubt, ease out (decelerate at the end). It's the single most-used curve in UI motion.",
    keyPrinciples: [
      "Linear = robotic. Eased = alive.",
      "More frames at start/end, fewer in middle",
      "Ease out is the default for UI",
    ],
    creativePractice: "Without using a computer, draw a 12-frame strip of a circle moving across a page using slow-in-and-out spacing — frames clustered at start and end, spread out in the middle.",
  },
  {
    id: "ap-arc",
    title: "Arc",
    subtitle: "Natural motion follows curves",
    chapter: 2,
    track: "animation-principles",
    description: "Almost nothing in nature moves in a perfectly straight line. Limbs swing in arcs, thrown objects follow parabolas, heads turn along curves. Straight-line motion looks mechanical.",
    theory: [
      "Joints rotate, so limbs naturally trace arcs. A waving hand traces a curve, not a zig-zag.",
      "Throwing motion follows a parabola due to gravity.",
      "In UI: a card that moves AND fades in a slight arc feels more alive than a straight diagonal slide.",
    ],
    aeContext: "Use AE's Motion Path editor to convert linear paths into bezier arcs. The result feels instantly more natural.",
    defaultBezier: [0.5, 0.0, 0.5, 1],
    tip: "If your motion path is a straight line, you're probably losing 30% of the perceived quality.",
    keyPrinciples: [
      "Joints create arcs",
      "Gravity creates parabolas",
      "Even subtle curving feels organic",
    ],
    creativePractice: "Toss a small object up and across the room. Sketch the arc you observe in 6 dot positions on paper. Compare it to a straight line — note which feels 'real'.",
  },
  {
    id: "ap-secondary",
    title: "Secondary Action",
    subtitle: "Supporting motion that adds richness",
    chapter: 3,
    track: "animation-principles",
    description: "Secondary action is a supporting movement that reinforces the main action without distracting from it. A character walks (primary) and swings their arms (secondary).",
    theory: [
      "Secondary actions add depth and personality but should never overpower the main action.",
      "Examples: a logo scales in (primary) while its shadow softens in (secondary).",
      "If your secondary action steals focus, demote it or remove it.",
    ],
    aeContext: "Layer subtle motion on supporting elements: shadows, particles, micro-rotations on icons.",
    defaultBezier: [0.3, 0, 0.3, 1],
    tip: "Test your animation with secondary actions OFF first. If primary reads clearly, ADD secondary to enhance.",
    keyPrinciples: [
      "Support, don't compete",
      "Subtle is better than loud",
      "Secondary action reveals personality",
    ],
    creativePractice: "Pick an everyday object (a teapot pouring, a pen clicking). List the primary action and 2-3 possible secondary actions. Sketch one frame that captures both.",
  },
  {
    id: "ap-timing",
    title: "Timing",
    subtitle: "How long things take = what they mean",
    chapter: 3,
    track: "animation-principles",
    description: "Timing is the number of frames an action takes. Fast = light, energetic, urgent. Slow = heavy, deliberate, dramatic. Timing IS emotion.",
    theory: [
      "Same arc, different timing → completely different meaning.",
      "UI standard: 200-300ms feels responsive. Under 100ms is invisible. Over 500ms feels sluggish.",
      "Different elements can have different timings to create rhythm and personality.",
    ],
    aeContext: "Adjust the time between keyframes to control speed. Shorter = snappier. Longer = more dramatic.",
    defaultBezier: [0.4, 0, 0.2, 1],
    tip: "If something feels 'off' but you can't say why, it's almost always timing. Try 20% faster or slower.",
    keyPrinciples: [
      "Timing changes meaning",
      "200-300ms is the UI sweet spot",
      "Vary timing to create rhythm",
    ],
    creativePractice: "With a stopwatch, time three real-world events (a door closing, a cup being placed down, a phone unlocking). Note the durations. Then design a UI animation matching the FEELING of each.",
  },
  {
    id: "ap-exaggeration",
    title: "Exaggeration",
    subtitle: "Push past reality for impact",
    chapter: 3,
    track: "animation-principles",
    description: "Pure realism in animation often feels flat. Exaggeration pushes poses, expressions, and motion past what's literal — keeping it believable but more impactful.",
    theory: [
      "Caricature: emphasize the essential, drop the rest.",
      "Exaggerated overshoots, squashes, and stretches make actions read at any speed.",
      "Restraint matters: too much exaggeration = chaos. Just past reality = magic.",
    ],
    aeContext: "Bump scale beyond 100% on bounce-in animations. Push overshoots to 110-115%. The motion suddenly POPS.",
    defaultBezier: [0.34, 1.6, 0.64, 1],
    tip: "When realism feels boring, exaggerate by 20%. Then dial back if it's too much.",
    keyPrinciples: [
      "Caricature, not chaos",
      "Exaggeration = clarity",
      "Push then refine",
    ],
    creativePractice: "Watch a clip from any Pixar film. Pick one expression or movement and sketch the literal version vs the exaggerated version. Note what was pushed.",
  },
  {
    id: "ap-solid-drawing",
    title: "Solid Drawing",
    subtitle: "Volume, weight, and 3D thinking",
    chapter: 3,
    track: "animation-principles",
    description: "Even in 2D animation, characters should feel like they exist in 3D space — with weight, volume, and consistent proportions. In motion design, this means honoring perspective and depth.",
    theory: [
      "Think in volumes (cubes, cylinders, spheres) — not flat shapes.",
      "Twin shapes (perfectly mirrored limbs/objects) look stiff. Vary slightly for life.",
      "Lighting and shading reinforce 3D form.",
    ],
    aeContext: "Use parallax, scale-on-Z, and subtle lighting shifts to give 2D layouts a 3D presence.",
    defaultBezier: [0.4, 0, 0.6, 1],
    tip: "Even when designing flat UIs, think about depth. It's why neumorphism and subtle shadows feel premium.",
    keyPrinciples: [
      "Think in 3D volumes",
      "Avoid twinning",
      "Light reveals form",
    ],
    creativePractice: "Draw a simple box (cube) from 3 different angles. Then draw the same box being squashed by an invisible weight. Pay attention to maintaining its volume in 3D.",
  },
  {
    id: "ap-appeal",
    title: "Appeal",
    subtitle: "The intangible quality of charm",
    chapter: 3,
    track: "animation-principles",
    description: "Appeal is the personality, charm, and magnetism of a character or design. It's what makes audiences WANT to watch. Hard to define — easy to feel.",
    theory: [
      "Appeal isn't 'cute' — it's clear, well-designed, interesting, and emotionally resonant.",
      "Strong silhouettes, clear personality, and confident proportions create appeal.",
      "In motion design: a brand's motion 'voice' creates appeal — Apple's calm precision, Duolingo's playful bounce.",
    ],
    aeContext: "Develop a motion 'voice' for every brand: their easing curves, durations, and overshoot tendencies should all feel consistent.",
    defaultBezier: [0.25, 0.1, 0.25, 1],
    tip: "If you can describe your animation's personality in one word (snappy, gentle, bold), it has appeal. If you can't — it's bland.",
    keyPrinciples: [
      "Appeal = personality + clarity",
      "Consistency creates voice",
      "Confidence reads as appeal",
    ],
    creativePractice: "Pick three brands you love (any industry). For each, write down ONE word that describes how their motion should feel. Sketch a simple shape transition that embodies that word — no software, just paper.",
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
