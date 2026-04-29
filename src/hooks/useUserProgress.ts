import { useCallback, useEffect, useState } from "react";

/* ---------------------------------------------------------------- */
/*  Persistent user progress (localStorage). One source of truth     */
/*  for completion, XP, streak, last-visited lesson, and quiz tries. */
/* ---------------------------------------------------------------- */

const KEY = "grohwie:progress:v1";

export interface ProgressState {
  completed: Record<string, { completedAt: number; attempts: number }>;
  xp: number;
  streak: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  lastLessonId: string | null;
  lastTrack: string | null;
  dailyChallenges: Record<string, boolean>; // YYYY-MM-DD => done
  quizAttempts: Record<string, number>; // lessonId => attempt count
}

const initial: ProgressState = {
  completed: {},
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  lastLessonId: null,
  lastTrack: null,
  dailyChallenges: {},
  quizAttempts: {},
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const dayDiff = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

function read(): ProgressState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}
function write(s: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("grohwie-progress"));
  } catch {
    /* ignore */
  }
}

export function useUserProgress() {
  const [state, setState] = useState<ProgressState>(read);

  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener("grohwie-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("grohwie-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((mut: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = mut(prev);
      write(next);
      return next;
    });
  }, []);

  const tickStreak = useCallback(() => {
    update((s) => {
      const today = todayKey();
      if (s.lastActiveDay === today) return s;
      let streak = s.streak;
      if (s.lastActiveDay && dayDiff(s.lastActiveDay, today) === 1) streak += 1;
      else streak = 1;
      return { ...s, streak, lastActiveDay: today };
    });
  }, [update]);

  const completeLesson = useCallback(
    (lessonId: string, xp = 25) => {
      update((s) => {
        const already = s.completed[lessonId];
        const attempts = (s.quizAttempts[lessonId] || 0) + 1;
        return {
          ...s,
          completed: {
            ...s.completed,
            [lessonId]: {
              completedAt: already?.completedAt ?? Date.now(),
              attempts,
            },
          },
          xp: already ? s.xp : s.xp + xp,
        };
      });
      tickStreak();
    },
    [update, tickStreak]
  );

  const recordQuizAttempt = useCallback(
    (lessonId: string) => {
      update((s) => ({
        ...s,
        quizAttempts: {
          ...s.quizAttempts,
          [lessonId]: (s.quizAttempts[lessonId] || 0) + 1,
        },
      }));
    },
    [update]
  );

  const setLastLesson = useCallback(
    (lessonId: string, track?: string) => {
      update((s) => ({
        ...s,
        lastLessonId: lessonId,
        lastTrack: track ?? s.lastTrack,
      }));
    },
    [update]
  );

  const completeDailyChallenge = useCallback(() => {
    update((s) => ({
      ...s,
      dailyChallenges: { ...s.dailyChallenges, [todayKey()]: true },
      xp: s.xp + 50,
    }));
    tickStreak();
  }, [update, tickStreak]);

  const isCompleted = (id: string) => Boolean(state.completed[id]);
  const dailyDone = Boolean(state.dailyChallenges[todayKey()]);
  const level = Math.max(1, Math.floor(state.xp / 200) + 1);

  return {
    state,
    isCompleted,
    dailyDone,
    level,
    completeLesson,
    recordQuizAttempt,
    setLastLesson,
    completeDailyChallenge,
  };
}