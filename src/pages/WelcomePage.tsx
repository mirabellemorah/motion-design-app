import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12">
      <button
        onClick={() => navigate("/")}
        className="self-end text-sm text-muted-foreground"
      >
        Skip
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex h-24 w-24 items-center justify-center rounded-2xl gradient-lavender"
        >
          <Sparkles className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-display text-3xl font-bold tracking-tight">
            Welcome to Motion
            <br />
            Design Academy
          </h1>
          <p className="mt-3 text-muted-foreground">
            Learn animation principles
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-xs rounded-2xl gradient-lavender p-5"
        >
          <p className="text-center text-sm leading-relaxed text-foreground/80">
            Master the fundamental principles that make animations feel amazing.
          </p>
        </motion.div>

        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className={`h-2 rounded-full ${i === 0 ? "w-6 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-xs space-y-3"
      >
        <p className="text-center text-xs text-muted-foreground">
          Start your journey into motion design!
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground"
        >
          Next →
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
