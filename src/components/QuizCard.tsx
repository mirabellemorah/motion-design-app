import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/data/lessons";

const QuizCard = ({ quiz }: { quiz: QuizQuestion }) => {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="soft-card p-4">
      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">Check Yourself</p>
      <p className="text-sm font-medium text-foreground mb-3">{quiz.q}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isPicked = pick === i;
          const isCorrect = i === quiz.correctIndex;
          const showState = pick !== null && (isPicked || isCorrect);
          return (
            <button
              key={i}
              onClick={() => pick === null && setPick(i)}
              disabled={pick !== null}
              className={`w-full text-left rounded-xl px-3 py-2.5 text-xs border transition-colors flex items-center justify-between ${
                showState && isCorrect
                  ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)] text-foreground"
                  : showState && isPicked
                  ? "border-destructive bg-destructive/10 text-foreground"
                  : "border-border bg-card text-foreground/80 hover:bg-accent/40"
              }`}
            >
              <span>{opt}</span>
              {showState && isCorrect && <Check className="h-3.5 w-3.5 text-[hsl(var(--success))]" />}
              {showState && isPicked && !isCorrect && <X className="h-3.5 w-3.5 text-destructive" />}
            </button>
          );
        })}
      </div>
      {pick !== null && quiz.explanation && (
        <p className="mt-3 text-[11px] text-muted-foreground">{quiz.explanation}</p>
      )}
    </div>
  );
};

export default QuizCard;