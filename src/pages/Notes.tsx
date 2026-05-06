import { Link } from "react-router-dom";
import { Bookmark, StickyNote, Layers, AlertCircle, BookMarked, ArrowRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFlashcardReviews } from "@/hooks/useFlashcardReviews";
import { useQuizAttempts } from "@/hooks/useQuizAttempts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModules, useSubtopics, useFlashcardsAdmin, useQuizQuestionsAdmin } from "@/hooks/useCurriculum";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

const tabs = [
  { id: "bookmarks", label: "Wichtige Themen", icon: Bookmark },
  { id: "notes", label: "Notizen", icon: StickyNote },
  { id: "hard", label: "Schwierige Karten", icon: Layers },
  { id: "wrong", label: "Falsche Quizfragen", icon: AlertCircle },
  { id: "terms", label: "Gespeicherte Begriffe", icon: BookMarked },
] as const;

export default function Notes() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("bookmarks");
  const { notes, create, remove } = useNotes();
  const { bookmarks, toggle } = useBookmarks();
  const { reviews } = useFlashcardReviews();
  const { attempts } = useQuizAttempts();
  const { data: modules } = useModules();
  const { data: subtopics } = useSubtopics();
  const { data: flashcards } = useFlashcardsAdmin("all");
  const { data: quizQuestions } = useQuizQuestionsAdmin("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const hardCards = useMemo(() => {
    const ids = reviews.filter((r) => r.last_rating === "missed" || r.ease < 2).map((r) => r.card_id);
    return flashcards.filter((c) => ids.includes(c.id));
  }, [reviews, flashcards]);

  const wrongQuestions = useMemo(() => {
    const counts = new Map<string, number>();
    attempts.forEach((a) => a.answers?.forEach((ans) => { if (!ans.correct) counts.set(ans.qid, (counts.get(ans.qid) ?? 0) + 1); }));
    return quizQuestions.filter((q) => counts.has(q.id)).map((q) => ({ ...q, wrongCount: counts.get(q.id) ?? 0 }));
  }, [attempts, quizQuestions]);

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold tracking-tight">Notizen & Lesezeichen</h1>
      <p className="text-muted-foreground">Alles, was du dir gemerkt hast – an einem Ort.</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors -mb-px",
                active ? "border-accent-blue text-accent-blue" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "bookmarks" && (
          bookmarks.length === 0 ? (
            <EmptyState icon={Bookmark} title="Keine Lesezeichen" description="Markiere Themen beim Lernen, um sie hier zu sammeln."
              action={<Button asChild><Link to="/module">Zum Lernen starten</Link></Button>} />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {bookmarks.map((b) => {
                const mod = modules.find((m) => m.id === b.module_id);
                const sub = subtopics.find((s) => s.id === (b.subtopic_id ?? ""));
                const href = sub ? `/module/${b.module_id}/${b.subtopic_id}` : `/module/${b.module_id}`;
                return (
                  <li key={b.id}>
                    <div className="card-base card-hover flex items-center justify-between p-5">
                      <Link to={href} className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground">{mod?.title}</div>
                        <div className="mt-0.5 truncate font-semibold">{b.label || sub?.title || mod?.title}</div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggle(b.module_id, b.subtopic_id)} className="text-xs text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}

        {tab === "notes" && (
          <div className="space-y-6">
            <div className="card-base p-5">
              <h3 className="font-semibold">Neue Notiz</h3>
              <div className="mt-3 space-y-2">
                <Input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Inhalt…" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
                <Button
                  size="sm"
                  disabled={!title.trim()}
                  onClick={async () => { await create({ title: title.trim(), content }); setTitle(""); setContent(""); }}
                >
                  Speichern
                </Button>
              </div>
            </div>

            {notes.length === 0 ? (
              <EmptyState icon={StickyNote} title="Noch keine Notizen" description="Erstelle eine Notiz oben oder direkt im Lernbereich." />
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => {
                  const mod = modules.find((m) => m.id === (n.module_id ?? ""));
                  return (
                    <li key={n.id} className="card-base p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{n.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(n.updated_at), { addSuffix: true, locale: de })}
                          </span>
                          <button onClick={() => remove(n.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {n.content && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{n.content}</p>}
                      {mod && <div className="mt-3 inline-flex rounded-full bg-accent-blue-soft px-2.5 py-0.5 text-xs font-medium text-accent-blue">{mod.title}</div>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === "hard" && (
          hardCards.length === 0 ? (
            <EmptyState icon={Layers} title="Keine schwierigen Karten" description="Karten, die du als 'nicht gewusst' markierst, erscheinen hier."
              action={<Button asChild><Link to="/flashcards">Flashcards üben</Link></Button>} />
          ) : (
            <ul className="space-y-3">
              {hardCards.map((c) => (
                <li key={c.id} className="card-base p-5">
                  <div className="text-sm font-semibold">{c.front}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{c.back}</div>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "wrong" && (
          wrongQuestions.length === 0 ? (
            <EmptyState icon={AlertCircle} title="Keine falschen Fragen" description="Mach eine Mock-Prüfung, um Schwächen zu sehen."
              action={<Button asChild><Link to="/pruefung">Prüfung starten</Link></Button>} />
          ) : (
            <ul className="space-y-3">
              {wrongQuestions.map((q) => (
                <li key={q.id} className="card-base p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold">{q.question}</div>
                    <span className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive">{q.wrongCount}×</span>
                  </div>
                  <div className="mt-2 text-sm text-success">✓ {q.options[q.correct_index]}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{q.explanation}</div>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === "terms" && (
          <EmptyState icon={BookMarked} title="Noch keine gespeicherten Begriffe" description="Speichere Begriffe aus dem Glossar für schnellen Zugriff."
            action={<Button asChild><Link to="/glossar">Zum Glossar</Link></Button>} />
        )}
      </div>
    </div>
  );
}
