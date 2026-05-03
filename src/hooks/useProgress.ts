import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ProgressStatus = "not_started" | "in_progress" | "review" | "done";

export interface SubtopicProgress {
  module_id: string;
  subtopic_id: string;
  status: ProgressStatus;
  progress_pct: number;
  last_visited_at: string;
}

export function useAllProgress() {
  const { user } = useAuth();
  const [data, setData] = useState<SubtopicProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setData([]); setLoading(false); return; }
    const { data: rows } = await supabase
      .from("subtopic_progress")
      .select("module_id,subtopic_id,status,progress_pct,last_visited_at")
      .eq("user_id", user.id);
    setData((rows ?? []) as SubtopicProgress[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export async function upsertProgress(
  userId: string,
  moduleId: string,
  subtopicId: string,
  patch: Partial<Pick<SubtopicProgress, "status" | "progress_pct">>
) {
  await supabase.from("subtopic_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      subtopic_id: subtopicId,
      status: patch.status ?? "in_progress",
      progress_pct: patch.progress_pct ?? 0,
      last_visited_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id,subtopic_id" }
  );
}
