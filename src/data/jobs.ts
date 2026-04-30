export interface Job {
  id: string;
  role: string;
  company: string;
  companyHue: number;
  type: "Full-time" | "Contract" | "Freelance" | "Part-time";
  location: string;
  remote: boolean;
  pay: string;
  posted: string;
  tags: string[];
  match: number;
  featured?: boolean;
  about: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  applyUrl?: string;
}

export const jobs: Job[] = [
  {
    id: "j1",
    role: "Senior Motion Designer",
    company: "Stripe",
    companyHue: 250,
    type: "Full-time",
    location: "Remote · Worldwide",
    remote: true,
    pay: "$140k – $180k",
    posted: "2d",
    tags: ["After Effects", "Lottie", "UI Motion"],
    match: 94,
    featured: true,
    about:
      "Stripe is hiring a senior motion designer to define how money moves through our products. You'll partner with Brand and Product to ship animations that make complex flows feel effortless.",
    responsibilities: [
      "Design end-to-end motion systems for product surfaces",
      "Prototype micro-interactions in After Effects and code-friendly formats",
      "Author Lottie files and easing tokens used by engineering",
      "Mentor mid-level designers across the motion craft",
    ],
    requirements: [
      "5+ years shipping motion at a product company",
      "Strong portfolio of UI motion, not just brand reels",
      "Fluent in After Effects, Figma, and Lottie",
      "Comfortable specifying easing in cubic-bezier values",
    ],
    perks: ["Fully remote", "Equity", "$2k learning budget", "Top-tier hardware"],
    applyUrl: "https://stripe.com/jobs",
  },
  {
    id: "j2",
    role: "Brand Animator",
    company: "Linear",
    companyHue: 220,
    type: "Contract",
    location: "Remote · EU",
    remote: true,
    pay: "$80 – $120 / hr",
    posted: "4d",
    tags: ["Motion", "Branding"],
    match: 88,
    about:
      "Six-month contract to extend Linear's brand into motion. Logo system, launch films, and a library of reusable transitions for marketing.",
    responsibilities: [
      "Animate brand assets for launches and social",
      "Build a reusable transition library in After Effects",
      "Collaborate weekly with the brand director",
    ],
    requirements: [
      "Strong reel of brand-led motion",
      "EU-based, overlap with CET working hours",
      "Self-directed contractor",
    ],
    perks: ["Remote", "Flexible hours", "Renewable contract"],
  },
  {
    id: "j3",
    role: "Product Designer (Motion)",
    company: "Arc Browser",
    companyHue: 15,
    type: "Full-time",
    location: "New York, NY",
    remote: false,
    pay: "$160k – $210k",
    posted: "1w",
    tags: ["Figma", "Prototyping", "Micro-interactions"],
    match: 81,
    about:
      "Help shape the next chapter of Arc. We're looking for a product designer who thinks in motion and prototypes ideas before pitching them.",
    responsibilities: [
      "Own end-to-end product surfaces from idea to launch",
      "Prototype interactions in Figma, Origami, or code",
      "Pair with engineers to ship with motion fidelity intact",
    ],
    requirements: [
      "4+ years in product design with a motion focus",
      "Based in NYC, in-office 3 days a week",
      "Strong written communication",
    ],
    perks: ["Equity", "Health", "Commuter stipend", "NYC HQ"],
  },
  {
    id: "j4",
    role: "Freelance Logo Reveal",
    company: "Acme Studio",
    companyHue: 30,
    type: "Freelance",
    location: "Remote",
    remote: true,
    pay: "$2,500 fixed",
    posted: "1d",
    tags: ["Logo", "After Effects", "1 week"],
    match: 76,
    about:
      "One-week gig: animate a 4-second logo reveal for a fintech client. Brand guidelines and final SVG provided.",
    responsibilities: [
      "Deliver a 4s logo reveal in After Effects",
      "Provide MP4 + transparent WebM + Lottie export",
      "Two rounds of revisions included",
    ],
    requirements: [
      "Reel showing logo animation work",
      "Available to start this week",
    ],
    perks: ["Fast turnaround", "Fixed scope", "Repeat work likely"],
  },
  {
    id: "j5",
    role: "Junior Motion Designer",
    company: "Notion",
    companyHue: 0,
    type: "Full-time",
    location: "San Francisco, CA",
    remote: false,
    pay: "$95k – $120k",
    posted: "3d",
    tags: ["Entry level", "Mentorship"],
    match: 72,
    about:
      "Notion is hiring a junior motion designer to grow inside our brand team. Strong mentorship from senior designers and a clear path to mid-level in 18 months.",
    responsibilities: [
      "Animate marketing assets and product moments",
      "Help maintain the motion component library",
      "Pair weekly with a senior mentor",
    ],
    requirements: [
      "1+ year of motion experience or strong personal work",
      "Eagerness to learn motion systems",
      "SF-based, hybrid 2 days a week",
    ],
    perks: ["Mentorship", "Equity", "Health", "SF office"],
  },
];