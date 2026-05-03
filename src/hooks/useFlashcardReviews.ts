import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Rating = "missed" | "unsure" | "knew";

export interface FlashcardReview {
  id: string;
  card_id: string;
  module_id: string | null;
  ease: number;
  interval_days: number;
  repetitions: number;
  last_rating: string | null;
  due_at: string;
  reviewed_at: string;
}

// Simple SM-2 lite
function nextSchedule(prev: { ease: number; interval_days: number; repetitions: number } | null, rating: Rating) {
  let ease = prev?.ease ?? 2.5;
  let reps = prev?.repetitions ?? 0;
  let interval = prev?.interval_days ?? 0;

  if (rating === "missed") {
    reps = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else if (rating === "unsure") {
    reps = reps + 1;
    interval = reps === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
    ease = Math.max(1.3, ease - 0.05);
  } else {
    reps = reps + 1;
    interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
    ease = ease + 0.1;
  }
  const due = new Date();
  due.setDate(due.getDate() + interval);
  return { ease, interval_days: interval, repetitions: reps, due_at: due.toISOString() };
}

export function useFlashcardReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<FlashcardReview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setReviews([]); setLoading(false); return; }
    const { data } = await supabase.from("flashcard_reviews").select("*").eq("user_id", user.id);
    setReviews((data ?? []) as FlashcardReview[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const rate = async (cardId: string, moduleId: string | null, rating: Rating) => {
    if (!user) return;
    const prev = reviews.find((r) => r.card_id === cardId) ?? null;
    const sched = nextSchedule(prev, rating);
    await supabase.from("flashcard_reviews").upsert(
      {
        user_id: user.id,
        card_id: cardId,
        module_id: moduleId,
        last_rating: rating,
        reviewed_at: new Date().toISOString(),
        ...sched,
      },
      { onConflict: "user_id,card_id" }
    );
    await refresh();
  };

  const dueCount = reviews.filter((r) => new Date(r.due_at) <= new Date()).length;

  return { reviews, loading, rate, refresh, dueCount };
}
