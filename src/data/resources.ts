export interface Resource {
  id: string;
  title: string;
  source: string;
  category: "Tutorial" | "Article" | "Tool" | "Inspiration" | "YouTube";
  url: string;
  blurb: string;
}

export const RESOURCES: Resource[] = [
  { id: "r1", title: "10 Principles of Motion Design", source: "VMG Studios", category: "Article", url: "https://blog.vmgstudios.com/10-principles-motion-design", blurb: "The seminal breakdown of timing, spacing, easing, mass, anticipation, and more." },
  { id: "r2", title: "Motion Design Principles", source: "Toptal", category: "Article", url: "https://www.toptal.com/designers/ux/motion-design-principles", blurb: "How motion shapes UX — easing, choreography, and meaningful animation in product." },
  { id: "r3", title: "Cubic Bezier Editor", source: "cubic-bezier.com", category: "Tool", url: "https://cubic-bezier.com", blurb: "Live preview while you drag the handles. Compare two curves side by side." },
  { id: "r4", title: "Easings.net", source: "easings.net", category: "Tool", url: "https://easings.net", blurb: "Visual library of every common easing curve with copy-paste CSS values." },
  { id: "r5", title: "Motion Design School", source: "YouTube", category: "YouTube", url: "https://www.youtube.com/c/motiondesignschoolofficial", blurb: "Practical AE walkthroughs and free workshops from working motion designers." },
  { id: "r6", title: "Ben Marriott", source: "YouTube", category: "YouTube", url: "https://www.youtube.com/c/BenMarriott", blurb: "After Effects tutorials with real production polish — ideal for intermediates." },
  { id: "r7", title: "Lottie Files", source: "lottiefiles.com", category: "Tool", url: "https://lottiefiles.com", blurb: "Free animation library + tools to export AE animations for web and mobile." },
  { id: "r8", title: "Mix.motion", source: "mix.motion", category: "Inspiration", url: "https://mix.motion", blurb: "Curated motion design references — best-in-class transitions, type, and brand work." },
  { id: "r9", title: "Awwwards Motion", source: "awwwards.com", category: "Inspiration", url: "https://www.awwwards.com/websites/animation/", blurb: "Daily inspiration from sites that use motion as a primary design tool." },
  { id: "r10", title: "The Animator's Survival Kit", source: "Richard Williams", category: "Article", url: "https://www.theanimatorssurvivalkit.com", blurb: "The book every motion designer should read once — then keep on the desk." },
  { id: "r11", title: "Material Motion Guidelines", source: "Google Material", category: "Article", url: "https://m3.material.io/styles/motion/overview", blurb: "Production-grade motion specs from Google — durations, easings, choreography." },
  { id: "r12", title: "Refactoring UI", source: "Adam Wathan & Steve Schoger", category: "Article", url: "https://www.refactoringui.com", blurb: "The clearest visual design fundamentals book for non-designers and devs." },
  { id: "r13", title: "Pinterest: Motion Design", source: "pinterest.com", category: "Inspiration", url: "https://www.pinterest.com/search/pins/?q=motion%20design", blurb: "Endless mood-board fuel — bookmark the boards you keep returning to." },
];