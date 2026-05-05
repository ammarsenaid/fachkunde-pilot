import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// ============ Types ============
export interface DBModule {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  estimated_minutes: number;
  position: number;
}
export interface DBSubtopic {
  id: string;
  module_id: string;
  title: string;
  description: string;
  reading_minutes: number;
  exam_relevance: number;
  position: number;
}
export interface DBFlashcard {
  id: string;
  module_id: string;
  subtopic_id: string | null;
  front: string;
  back: string;
  arabic_hint: string | null;
  difficulty: "easy" | "medium" | "hard";
}
export interface DBQuizQuestion {
  id: string;
  module_id: string;
  subtopic_id: string | null;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  arabic_explanation: string | null;
}
export interface DBGlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  arabic: string | null;
}

// ============ Modules ============
export function useModules() {
  const [data, setData] = useState<DBModule[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .order("position", { ascending: true });
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setData((data as DBModule[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const upsert = async (m: Partial<DBModule> & { id: string; title: string; number: number }) => {
    const { error } = await supabase.from("modules").upsert(m);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  return { data, loading, refresh, upsert, remove };
}

// ============ Subtopics ============
export function useSubtopics(moduleId?: string) {
  const [data, setData] = useState<DBSubtopic[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("subtopics").select("*").order("position", { ascending: true });
    if (moduleId) q = q.eq("module_id", moduleId);
    const { data, error } = await q;
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setData((data as DBSubtopic[]) ?? []);
    setLoading(false);
  }, [moduleId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const upsert = async (s: Partial<DBSubtopic> & { id: string; module_id: string; title: string }) => {
    const { error } = await supabase.from("subtopics").upsert(s);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("subtopics").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  return { data, loading, refresh, upsert, remove };
}

// ============ Flashcards ============
export function useFlashcardsAdmin(moduleId?: string) {
  const [data, setData] = useState<DBFlashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("flashcards").select("*").order("created_at", { ascending: true });
    if (moduleId && moduleId !== "all") q = q.eq("module_id", moduleId);
    const { data, error } = await q;
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setData((data as DBFlashcard[]) ?? []);
    setLoading(false);
  }, [moduleId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = async (f: Omit<DBFlashcard, "id">) => {
    const { error } = await supabase.from("flashcards").insert(f);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const update = async (id: string, f: Partial<Omit<DBFlashcard, "id">>) => {
    const { error } = await supabase.from("flashcards").update(f).eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("flashcards").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  return { data, loading, refresh, create, update, remove };
}

// ============ Quiz Questions ============
export function useQuizQuestionsAdmin(moduleId?: string) {
  const [data, setData] = useState<DBQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("quiz_questions").select("*").order("created_at", { ascending: true });
    if (moduleId && moduleId !== "all") q = q.eq("module_id", moduleId);
    const { data, error } = await q;
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setData(((data ?? []) as any[]).map((r) => ({
      ...r,
      options: Array.isArray(r.options) ? r.options : (typeof r.options === "string" ? JSON.parse(r.options) : []),
    })) as DBQuizQuestion[]);
    setLoading(false);
  }, [moduleId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = async (q: Omit<DBQuizQuestion, "id">) => {
    const { error } = await supabase.from("quiz_questions").insert(q as any);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const update = async (id: string, q: Partial<Omit<DBQuizQuestion, "id">>) => {
    const { error } = await supabase.from("quiz_questions").update(q as any).eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  return { data, loading, refresh, create, update, remove };
}

// ============ Glossary ============
export function useGlossary() {
  const [data, setData] = useState<DBGlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .order("term", { ascending: true });
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    setData((data as DBGlossaryTerm[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = async (g: Omit<DBGlossaryTerm, "id">) => {
    const { error } = await supabase.from("glossary_terms").insert(g);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const update = async (id: string, g: Partial<Omit<DBGlossaryTerm, "id">>) => {
    const { error } = await supabase.from("glossary_terms").update(g).eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
    if (error) { toast({ title: "Fehler", description: error.message, variant: "destructive" }); return false; }
    await refresh();
    return true;
  };
  return { data, loading, refresh, create, update, remove };
}
