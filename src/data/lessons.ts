import { Clock, TrendingUp, Circle, Eye, ArrowRight, RotateCw, Layers, Layout } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Clock;
  color: string;
  keyPrinciples: string[];
  tip: string;
  defaultParams: AnimationParams;
}

export interface AnimationParams {
  duration: number;
  easing: string;
  delay: number;
  bounce?: number;
  stiffness?: number;
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

export const EASING_OPTIONS = [
  { label: "Linear", value: "linear" },
  { label: "Ease In", value: "easeIn" },
  { label: "Ease Out", value: "easeOut" },
  { label: "Ease In Out", value: "easeInOut" },
  { label: "Spring", value: "spring" },
];

export const lessons: Lesson[] = [
  {
    id: "timing-spacing",
    title: "Timing & Spacing",
    subtitle: "Control the speed and rhythm of your animations",
    description: "Timing is how long an animation takes, while spacing is how the motion is distributed across that time. Together they create the feel of weight, momentum, and personality.",
    icon: Clock,
    color: "lavender",
    keyPrinciples: [
      "Slow animations feel heavy and deliberate",
      "Fast animations feel light and snappy",
      "Most UI animations should be 200-500ms",
      "Shorter feels jerky, longer feels sluggish",
    ],
    tip: "Most UI animations feel best between 200-400ms. Any longer feels sluggish, any shorter feels jarring.",
    defaultParams: { duration: 0.4, easing: "easeInOut", delay: 0 },
  },
  {
    id: "easing",
    title: "Easing",
    subtitle: "Make animations feel natural with curves",
    description: "Easing defines the acceleration curve of an animation. Nothing in nature moves at a constant speed — easing makes motion feel organic and alive.",
    icon: TrendingUp,
    color: "sage",
    keyPrinciples: [
      "Linear motion feels robotic and unnatural",
      "Ease-out is best for elements entering the screen",
      "Ease-in is best for elements leaving the screen",
      "Ease-in-out works great for state transitions",
    ],
    tip: "Use ease-out for entrances and ease-in for exits. This mimics how objects naturally accelerate and decelerate.",
    defaultParams: { duration: 0.5, easing: "easeOut", delay: 0 },
  },
  {
    id: "squash-stretch",
    title: "Squash & Stretch",
    subtitle: "Add life and flexibility to your animations",
    description: "Squash and stretch is the most important principle in animation. It gives a sense of weight and flexibility to objects, making them feel alive rather than rigid.",
    icon: Circle,
    color: "lavender",
    keyPrinciples: [
      "Preserve volume — when an object squashes, it should widen",
      "More squash/stretch = more cartoony feel",
      "Subtle amounts work great for UI elements",
      "Apply to buttons, modals, and bouncing elements",
    ],
    tip: "Keep squash and stretch subtle for UI. A scale of 0.95-1.05 is usually enough for buttons and cards.",
    defaultParams: { duration: 0.6, easing: "spring", delay: 0, bounce: 0.4 },
  },
  {
    id: "anticipation",
    title: "Anticipation",
    subtitle: "Prepare the viewer for what's about to happen",
    description: "Anticipation is a small movement that precedes a larger action. It tells the user something is about to change, creating a sense of cause and effect.",
    icon: Eye,
    color: "sage",
    keyPrinciples: [
      "A small wind-up before a big action",
      "Helps users predict what will happen next",
      "Pull back before launching forward",
      "Great for delete confirmations and page transitions",
    ],
    tip: "Use a subtle scale-down (0.95) before scaling up to draw attention to important state changes.",
    defaultParams: { duration: 0.5, easing: "easeInOut", delay: 0.1 },
  },
  {
    id: "follow-through",
    title: "Follow Through",
    subtitle: "Different parts move at different rates",
    description: "Follow through means that different parts of an object don't stop at the same time. When a main body stops, secondary elements continue to move briefly.",
    icon: ArrowRight,
    color: "lavender",
    keyPrinciples: [
      "Elements overshoot their target slightly",
      "Creates a feeling of physics and momentum",
      "Stagger child elements for organic feel",
      "Use for lists, cards, and navigation transitions",
    ],
    tip: "Stagger animations by 50-100ms between elements to create a natural cascade effect.",
    defaultParams: { duration: 0.5, easing: "spring", delay: 0, bounce: 0.3 },
  },
  {
    id: "arcs",
    title: "Arcs",
    subtitle: "Natural movement follows curved paths",
    description: "Most natural movements follow arcs rather than straight lines. Curved motion paths make animations feel more natural and organic.",
    icon: RotateCw,
    color: "sage",
    keyPrinciples: [
      "Straight-line motion feels mechanical",
      "Curved paths feel natural and organic",
      "Use for element repositioning",
      "Great for navigation and page transitions",
    ],
    tip: "When moving elements across the screen, add a slight curve to the path for a more natural feel.",
    defaultParams: { duration: 0.6, easing: "easeInOut", delay: 0 },
  },
  {
    id: "secondary-action",
    title: "Secondary Action",
    subtitle: "Supporting animations that enhance the main action",
    description: "Secondary actions are supplementary movements that support the main action. They add richness and dimension to your animations without taking focus away.",
    icon: Layers,
    color: "lavender",
    keyPrinciples: [
      "Should support, not compete with main action",
      "Adds depth and polish to interactions",
      "Examples: shadow changes, color shifts, icon rotations",
      "Keep secondary actions subtle",
    ],
    tip: "Pair a position change with opacity and scale changes for richer, more polished transitions.",
    defaultParams: { duration: 0.4, easing: "easeOut", delay: 0.05 },
  },
  {
    id: "staging",
    title: "Staging",
    subtitle: "Direct the viewer's attention clearly",
    description: "Staging is the presentation of an idea so that it is unmistakably clear. In UI, it means directing user attention to the most important element on screen.",
    icon: Layout,
    color: "sage",
    keyPrinciples: [
      "One main action per screen transition",
      "Dim or blur non-essential elements",
      "Use motion to guide the eye",
      "Create clear visual hierarchy with animation",
    ],
    tip: "When showing a modal, dim the background and scale up the modal to clearly stage the new content.",
    defaultParams: { duration: 0.35, easing: "easeOut", delay: 0 },
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
