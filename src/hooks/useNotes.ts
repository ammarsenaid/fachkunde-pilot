import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Note {
  id: string;
  module_id: string | null;
  subtopic_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useNotes(filter?: { moduleId?: string; subtopicId?: string }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setNotes([]); setLoading(false); return; }
    let q = supabase.from("notes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (filter?.moduleId) q = q.eq("module_id", filter.moduleId);
    if (filter?.subtopicId) q = q.eq("subtopic_id", filter.subtopicId);
    const { data } = await q;
    setNotes((data ?? []) as Note[]);
    setLoading(false);
  }, [user, filter?.moduleId, filter?.subtopicId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (input: { title: string; content?: string; module_id?: string | null; subtopic_id?: string | null }) => {
    if (!user) return;
    await supabase.from("notes").insert({ user_id: user.id, content: "", ...input });
    await refresh();
  };

  const update = async (id: string, patch: Partial<Pick<Note, "title" | "content">>) => {
    await supabase.from("notes").update(patch).eq("id", id);
    await refresh();
  };

  const remove = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    await refresh();
  };

  return { notes, loading, refresh, create, update, remove };
}
