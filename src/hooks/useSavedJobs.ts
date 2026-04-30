import { useEffect, useState, useCallback } from "react";

const KEY = "grohwie:savedJobs:v1";

const read = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const useSavedJobs = () => {
  const [saved, setSaved] = useState<string[]>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSaved(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: string[]) => {
    setSaved(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const toggle = useCallback(
    (id: string) => {
      const next = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
      persist(next);
      return next.includes(id);
    },
    [saved],
  );

  return { saved, isSaved, toggle };
};