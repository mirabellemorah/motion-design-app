import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCw, Sparkles } from "lucide-react";
import type { QuizQuestion } from "@/data/lessons";

interface QuizCardProps {
  quiz: QuizQuestion;
  onCorrect?: (attempts: number) => void;
  onAttempt?: () => void;
}

/**
 * Retry-flow quiz: wrong answer shows an immediate explanation and a
 * Try Again button. Lesson is only marked complete when the user
 * eventually picks the correct answer. Tracks attempt count.
 */
const QuizCard = ({ quiz, onCorrect, onAttempt }: QuizCardProps) => {
  const [pick, setPick] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const handlePick = (i: number) => {
    if (pick !== null) return;
    setPick(i);
    setAttempts((a) => a + 1);
    onAttempt?.();
    if (i === quiz.correctIndex) {
      setSolved(true);
      onCorrect?.(attempts + 1);
    }
  };

  const reset = () => setPick(null);

  const wrongExplanation =
    pick !== null && pick !== quiz.correctIndex
      ? quiz.optionExplanations?.[pick] ?? "Not quite — read each option carefully and try the next one."
      : null;

  const correctExplanation =
    quiz.optionExplanations?.[quiz.correctIndex] ?? quiz.explanation;

  return (
    <div className="soft-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Check Yourself</p>
        {attempts > 0 && (
          <span className="text-[10px] text-muted-foreground">
            Attempt {attempts}{solved ? " · solved" : ""}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-foreground mb-3">{quiz.q}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isPicked = pick === i;
          const isCorrect = i === quiz.correctIndex;
          const showCorrect = pick !== null && isCorrect && (solved || isPicked);
          const showWrong = pick !== null && isPicked && !isCorrect;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={pick !== null}
              className={`w-full text-left rounded-xl px-3 py-2.5 text-xs border transition-colors flex items-center justify-between ${
                showCorrect
                  ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)] text-foreground"
                  : showWrong
                  ? "border-destructive bg-destructive/10 text-foreground"
                  : "border-border bg-card text-foreground/80 hover:bg-accent/40 disabled:opacity-60"
              }`}
            >
              <span>{opt}</span>
              {showCorrect && <Check className="h-3.5 w-3.5 text-[hsl(var(--success))]" />}
              {showWrong && <X className="h-3.5 w-3.5 text-destructive" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {wrongExplanation && (
          <motion.div
            key="wrong"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3"
          >
            <p className="text-[11px] font-semibold text-destructive uppercase tracking-wider mb-1">
              Not quite
            </p>
            <p className="text-[12px] text-foreground/80 leading-relaxed mb-2.5">
              {wrongExplanation}
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-[11px] font-semibold"
            >
              <RotateCw className="h-3 w-3" /> Try again
            </button>
          </motion.div>
        )}

        {solved && (
          <motion.div
            key="right"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-3"
          >
            <p className="text-[11px] font-semibold text-[hsl(var(--success))] uppercase tracking-wider mb-1 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Correct
            </p>
            {correctExplanation && (
              <p className="text-[12px] text-foreground/80 leading-relaxed">{correctExplanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizCard;