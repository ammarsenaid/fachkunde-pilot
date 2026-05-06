import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Lightbulb, AlertCircle, Languages, CheckCircle2, Layers, ClipboardCheck, Star, StickyNote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAllProgress, upsertProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/contexts/AuthContext";
import { useModules, useSubtopics } from "@/hooks/useCurriculum";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MappingChunk { id: string; title: string | null; chunk_text: string; position: number; }

export default function SubtopicLearn() {
  const { moduleId, subtopicId } = useParams();
  const { data: modules, loading: modulesLoading } = useModules();
  const { data: moduleSubs, loading: subsLoading } = useSubtopics(moduleId);
  const module = modules.find((m) => m.id === moduleId);
  const subtopic = moduleSubs.find((s) => s.id === subtopicId) ?? moduleSubs[0];

  const [showArabic, setShowArabic] = useState(false);
  const [chunks, setChunks] = useState<MappingChunk[]>([]);
  const [chunksLoading, setChunksLoading] = useState(false);

  const { user } = useAuth();
  const { data: progress, refresh } = useAllProgress();
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
  const noteFilter = useMemo(() => ({ moduleId: module?.id, subtopicId: subtopic?.id }), [module?.id, subtopic?.id]);
  const { notes, create: createNote, remove: removeNote } = useNotes(noteFilter);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const progRow = progress.find((p) => p.module_id === module?.id && p.subtopic_id === subtopic?.id);
  const checks = {
    read: !!progRow && progRow.progress_pct >= 33,
    flashcards: !!progRow && progRow.progress_pct >= 66,
    quiz: !!progRow && progRow.status === "done",
  };

  // Load mapped PDF content for this subtopic
  useEffect(() => {
    if (!module?.id || !subtopic?.id) return;
    setChunksLoading(true);
    supabase
      .from("content_mappings")
      .select("id, title, chunk_text, position")
      .eq("module_id", module.id)
      .eq("subtopic_id", subtopic.id)
      .order("position", { ascending: true })
      .then(({ data }) => {
        setChunks((data ?? []) as MappingChunk[]);
        setChunksLoading(false);
      });
  }, [module?.id, subtopic?.id]);

  // Auto-mark in_progress
  useEffect(() => {
    if (!user || !module || !subtopic) return;
    if (!progRow) {
      void upsertProgress(user.id, module.id, subtopic.id, { status: "in_progress", progress_pct: 10 }).then(refresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, module?.id, subtopic?.id]);

  async function toggleCheck(kind: "read" | "flashcards" | "quiz") {
    if (!user || !module || !subtopic) return;
    const next = { ...checks, [kind]: !checks[kind] };
    const pct = (next.read ? 33 : 0) + (next.flashcards ? 33 : 0) + (next.quiz ? 34 : 0);
    const status = pct >= 100 ? "done" : pct > 0 ? "in_progress" : "not_started";
    await upsertProgress(user.id, module.id, subtopic.id, { status, progress_pct: pct });
    refresh();
  }

  if (modulesLoading || subsLoading) {
    return <div className="container-page py-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!module || !subtopic) {
    return (
      <div className="container-page py-12">
        <Link to="/module" className="text-accent-blue">← Zurück zu Module</Link>
        <p className="mt-4 text-sm text-muted-foreground">Inhalt nicht gefunden.</p>
      </div>
    );
  }

  const bookmarked = isBookmarked(module.id, subtopic.id);

  return (
    <div className="container-page py-6">
      <Link to={`/module/${module.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {module.title}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Left: subtopic nav */}
        <aside className="hidden lg:block">
          <div className="card-base sticky top-20 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Modul {module.number}</div>
            <div className="mt-1 font-semibold">{module.title}</div>
            <ul className="mt-4 space-y-1">
              {moduleSubs.map((s, i) => (
                <li key={s.id}>
                  <Link
                    to={`/module/${module.id}/${s.id}`}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      s.id === subtopic.id ? "bg-accent-blue-soft text-accent-blue font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span className="mt-0.5 text-xs font-mono opacity-60">{i + 1}.</span>
                    <span className="line-clamp-2">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center: reader */}
        <article className="card-base p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {subtopic.reading_minutes} Min Lesezeit</span>
            {subtopic.exam_relevance === 3 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 font-medium text-warning">
                <Star className="h-3 w-3" /> Hoch prüfungsrelevant
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{subtopic.title}</h1>
          {subtopic.description && <p className="mt-3 text-lg text-muted-foreground">{subtopic.description}</p>}

          {/* Mapped content */}
          <div className="prose prose-slate mt-6 max-w-none text-foreground">
            {chunksLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            {!chunksLoading && chunks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <Lightbulb className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Für dieses Unterthema sind noch keine Inhalte zugeordnet.<br />
                  Im Admin-Bereich kann ein PDF hochgeladen und Seiten zugeordnet werden.
                </p>
              </div>
            )}
            {chunks.map((c) => (
              <section key={c.id} className="mt-6 first:mt-0">
                {c.title && <h2 className="text-xl font-semibold">{c.title}</h2>}
                <p className="mt-2 whitespace-pre-wrap leading-relaxed">{c.chunk_text}</p>
              </section>
            ))}
          </div>

          {chunks.length > 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-warning-soft/60 p-5">
              <div className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Prüfungsrelevant</span>
              </div>
              <p className="mt-2 text-sm text-foreground">
                Markiere wichtige Stellen mit dem Stern-Button rechts und übe das Thema mit Flashcards & Quiz.
              </p>
            </div>
          )}

          {/* Arabic toggle (kept as UI) */}
          <div className="mt-6">
            <Button variant="outline" onClick={() => setShowArabic((v) => !v)}>
              <Languages className="mr-2 h-4 w-4" />
              {showArabic ? "Arabische Erklärung ausblenden" : "Arabische Erklärung anzeigen"}
            </Button>
            {showArabic && (
              <div className="mt-3 rounded-2xl border border-border bg-secondary/60 p-5 font-arabic text-right" dir="rtl">
                <p className="leading-loose text-muted-foreground">
                  الترجمة العربية لهذا الموضوع غير متوفرة بعد. يمكن إضافتها لاحقاً عبر لوحة الإدارة.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Right: tools */}
        <aside className="space-y-4">
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold">Lernfortschritt</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              {([
                ["read", "Gelesen"],
                ["flashcards", "Flashcards gemacht"],
                ["quiz", "Quiz bestanden"],
              ] as const).map(([k, label]) => (
                <li key={k}>
                  <button
                    onClick={() => toggleCheck(k)}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    <CheckCircle2 className={cn("h-5 w-5 transition-colors", checks[k] ? "text-success" : "text-muted-foreground/40")} />
                    <span className={checks[k] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-base p-5 space-y-2">
            <Button asChild className="w-full justify-start bg-primary hover:bg-primary-hover">
              <Link to="/flashcards"><Layers className="mr-2 h-4 w-4" /> Flashcards starten</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/pruefung"><ClipboardCheck className="mr-2 h-4 w-4" /> Quiz starten</Link>
            </Button>
            <Button
              variant="outline"
              className={cn("w-full justify-start", bookmarked && "border-warning text-warning")}
              onClick={async () => {
                await toggleBookmark(module.id, subtopic.id, subtopic.title);
                toast({ title: bookmarked ? "Lesezeichen entfernt" : "Als wichtig markiert" });
              }}
            >
              <Star className={cn("mr-2 h-4 w-4", bookmarked && "fill-warning")} />
              {bookmarked ? "Markierung entfernen" : "Als wichtig markieren"}
            </Button>
          </div>

          <div className="card-base p-5">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-accent-blue" />
              <h3 className="text-sm font-semibold">Notizen</h3>
            </div>
            <div className="mt-3 space-y-2">
              <Input placeholder="Titel" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              <Textarea placeholder="Deine Notiz…" rows={3} value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
              <Button
                size="sm"
                className="w-full"
                disabled={!noteTitle.trim()}
                onClick={async () => {
                  await createNote({ title: noteTitle.trim(), content: noteContent, module_id: module.id, subtopic_id: subtopic.id });
                  setNoteTitle(""); setNoteContent("");
                  toast({ title: "Notiz gespeichert" });
                }}
              >
                Notiz speichern
              </Button>
            </div>
            {notes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium">{n.title}</div>
                      <button onClick={() => removeNote(n.id)} className="text-xs text-muted-foreground hover:text-destructive">Löschen</button>
                    </div>
                    {n.content && <p className="mt-1 text-muted-foreground">{n.content}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
