import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12">
      <button onClick={() => navigate("/")} className="self-end ae-mono text-[11px] text-muted-foreground">
        SKIP →
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* AE Graph Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
            <rect x="0" y="0" width="120" height="120" rx="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            {/* Mini grid */}
            {[30, 60, 90].map(v => (
              <g key={v}>
                <line x1="15" y1={v} x2="105" y2={v} stroke="hsl(var(--ae-grid))" strokeWidth="0.5" />
                <line x1={v} y1="15" x2={v} y2="105" stroke="hsl(var(--ae-grid))" strokeWidth="0.5" />
              </g>
            ))}
            {/* Curve */}
            <motion.path
              d="M 15 105 C 50 105, 70 15, 105 15"
              fill="none"
              stroke="hsl(var(--ae-yellow))"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
            {/* Control handles */}
            <line x1="15" y1="105" x2="50" y2="105" stroke="hsl(var(--ae-yellow) / 0.4)" strokeWidth="1" />
            <line x1="105" y1="15" x2="70" y2="15" stroke="hsl(var(--ae-yellow) / 0.4)" strokeWidth="1" />
            <circle cx="50" cy="105" r="4" fill="hsl(var(--ae-yellow))" />
            <circle cx="70" cy="15" r="4" fill="hsl(var(--ae-yellow))" />
            {/* Keyframes */}
            <rect x="11" y="101" width="8" height="8" rx="1" fill="hsl(var(--ae-yellow))" transform="rotate(45, 15, 105)" />
            <rect x="101" y="11" width="8" height="8" rx="1" fill="hsl(var(--ae-yellow))" transform="rotate(45, 105, 15)" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-semibold tracking-tight">
            Master the
            <br />
            <span style={{ color: "hsl(var(--ae-yellow))" }}>Graph Editor</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-[260px]">
            Learn to read and shape bezier curves like a professional motion designer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="ae-panel p-4 max-w-[280px] w-full"
        >
          <div className="space-y-2 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--ae-yellow))" }} />
              <span>Understand Value & Speed graphs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--ae-green))" }} />
              <span>Drag bezier handles to shape curves</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--ae-blue))" }} />
              <span>Practice matching professional curves</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-xs space-y-3"
      >
        <Button
          onClick={() => navigate("/")}
          className="w-full rounded-lg py-6 text-sm font-semibold"
        >
          Start Learning →
        </Button>
        <p className="text-center ae-mono text-[10px] text-muted-foreground">
          USED AT NIKE • GOOGLE • APPLE
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
