import { useState } from "react";
import { BookOpen, Layers, ClipboardCheck, BookMarked, Upload, Plus, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { modules } from "@/data";

const sections = [
  { id: "modules", label: "Module", icon: BookOpen },
  { id: "subtopics", label: "Unterthemen", icon: BookOpen },
  { id: "content", label: "Inhalte & PDF", icon: Upload },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quizfragen", icon: ClipboardCheck },
  { id: "glossary", label: "Glossar", icon: BookMarked },
] as const;

export default function Admin() {
  const [section, setSection] = useState<typeof sections[number]["id"]>("modules");

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <p className="text-muted-foreground">Inhalte verwalten – Module, Unterthemen, Karten, Quiz und Glossar.</p>
        </div>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" /> Lerneransicht
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card-base p-2">
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    section === s.id ? "bg-accent-blue-soft text-accent-blue" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" /> {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-4">
          {section === "modules" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Module</h2>
                <Button className="bg-primary hover:bg-primary-hover"><Plus className="mr-1.5 h-4 w-4" /> Neues Modul</Button>
              </div>
              <div className="card-base divide-y divide-border">
                {modules.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold">{m.number}</span>
                      <div>
                        <div className="font-medium">{m.title}</div>
                        <div className="text-xs text-muted-foreground">{m.subtopicCount} Unterthemen</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">Bearbeiten</Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">Löschen</Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === "content" && (
            <>
              <h2 className="text-lg font-semibold">Inhalte hinzufügen</h2>
              <div className="card-base p-6">
                <label className="text-sm font-medium">PDF / Buch hochladen</label>
                <div className="mt-3 rounded-2xl border-2 border-dashed border-border p-10 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="mt-3 text-sm font-medium">PDF hierher ziehen oder klicken</div>
                  <p className="mt-1 text-xs text-muted-foreground">Wird später automatisch in Module aufgeteilt</p>
                  <Button className="mt-4" variant="outline">Datei auswählen</Button>
                </div>
              </div>
              <div className="card-base p-6">
                <label className="text-sm font-medium">Lesetext hinzufügen</label>
                <Input className="mt-3" placeholder="Titel" />
                <textarea className="mt-3 min-h-[160px] w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Inhalt eingeben…" />
                <div className="mt-3 flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <Star className="h-3.5 w-3.5 text-warning" /> Als prüfungsrelevant markieren
                  </label>
                  <Button className="bg-primary hover:bg-primary-hover">Speichern</Button>
                </div>
              </div>
            </>
          )}

          {section === "flashcards" && (
            <>
              <h2 className="text-lg font-semibold">Flashcards</h2>
              <div className="card-base p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Frage (Vorderseite)</label>
                    <textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Was ist der Zweck des PBefG?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Antwort (Rückseite)</label>
                    <textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Es regelt …" />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button className="bg-primary hover:bg-primary-hover">Karte hinzufügen</Button>
                </div>
              </div>
            </>
          )}

          {section === "quiz" && (
            <>
              <h2 className="text-lg font-semibold">Quizfrage hinzufügen</h2>
              <div className="card-base space-y-3 p-6">
                <Input placeholder="Frage" />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="radio" name="correct" />
                    <Input placeholder={`Antwort ${String.fromCharCode(65 + i)}`} />
                  </div>
                ))}
                <textarea className="min-h-[80px] w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Erklärung" />
                <div className="flex justify-end"><Button className="bg-primary hover:bg-primary-hover">Speichern</Button></div>
              </div>
            </>
          )}

          {section === "glossary" && (
            <>
              <h2 className="text-lg font-semibold">Glossar-Begriff</h2>
              <div className="card-base space-y-3 p-6">
                <Input placeholder="Begriff" />
                <Input placeholder="Kategorie" />
                <textarea className="min-h-[80px] w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Deutsche Erklärung" />
                <textarea className="min-h-[80px] w-full rounded-lg border border-border bg-background p-3 text-sm font-arabic text-right" dir="rtl" placeholder="الشرح بالعربية (اختياري)" />
                <div className="flex justify-end"><Button className="bg-primary hover:bg-primary-hover">Hinzufügen</Button></div>
              </div>
            </>
          )}

          {section === "subtopics" && (
            <>
              <h2 className="text-lg font-semibold">Unterthemen</h2>
              <div className="card-base p-6 text-sm text-muted-foreground">
                Wähle ein Modul, um seine Unterthemen zu verwalten.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
