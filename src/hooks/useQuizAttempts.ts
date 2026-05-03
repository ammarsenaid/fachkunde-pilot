import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface QuizAttempt {
  id: string;
  module_id: string | null;
  score: number;
  total: number;
  duration_seconds: number;
  answers: Array<{ qid: string; correct: boolean; selected: number }>;
  created_at: string;
}

export function useQuizAttempts() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setAttempts([]); setLoading(false); return; }
    const { data } = await supabase
      .from("quiz_attempts").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(50);
    setAttempts((data ?? []) as unknown as QuizAttempt[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = async (a: Omit<QuizAttempt, "id" | "created_at">) => {
    if (!user) return;
    await supabase.from("quiz_attempts").insert([{
      user_id: user.id,
      module_id: a.module_id ?? null,
      score: a.score,
      total: a.total,
      duration_seconds: a.duration_seconds,
      answers: a.answers as never,
    }]);
    await refresh();
  };

  return { attempts, loading, save, refresh };
}
