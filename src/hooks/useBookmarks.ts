import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Bookmark {
  id: string;
  module_id: string;
  subtopic_id: string | null;
  label: string | null;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setBookmarks([]); setLoading(false); return; }
    const { data } = await supabase.from("bookmarks").select("*").eq("user_id", user.id);
    setBookmarks((data ?? []) as Bookmark[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const isBookmarked = (moduleId: string, subtopicId?: string | null) =>
    bookmarks.some((b) => b.module_id === moduleId && (b.subtopic_id ?? null) === (subtopicId ?? null));

  const toggle = async (moduleId: string, subtopicId?: string | null, label?: string) => {
    if (!user) return;
    const existing = bookmarks.find((b) => b.module_id === moduleId && (b.subtopic_id ?? null) === (subtopicId ?? null));
    if (existing) {
      await supabase.from("bookmarks").delete().eq("id", existing.id);
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id, module_id: moduleId, subtopic_id: subtopicId ?? null, label: label ?? null,
      });
    }
    await refresh();
  };

  return { bookmarks, loading, isBookmarked, toggle, refresh };
}
