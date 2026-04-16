import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12">
      <button onClick={() => navigate("/")} className="self-end text-[11px] text-muted-foreground font-medium tracking-wide">
        SKIP →
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative"
        >
          <div className="h-28 w-28 rounded-3xl bg-secondary flex items-center justify-center shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Motion Principles
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-[280px] leading-relaxed">
            Learn the fundamental principles that make beautiful motion design through interactive challenges
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-[280px] w-full space-y-3"
        >
          {[
            { color: "bg-primary/15", label: "Interactive Learning", desc: "Practice with real-time feedback" },
            { color: "bg-primary/15", label: "12 Core Principles", desc: "Master animation fundamentals" },
            { color: "bg-primary/15", label: "Track Progress", desc: "Monitor your improvement" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-xs space-y-3"
      >
        <Button
          onClick={() => navigate("/")}
          className="w-full rounded-2xl py-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          Get Started
        </Button>
        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-xs text-muted-foreground"
        >
          I already have an account
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
