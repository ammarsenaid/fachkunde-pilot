import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Layers, ClipboardCheck, BookMarked, Upload, Eye, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PdfManager } from "@/components/PdfManager";
import { ModulesAdmin } from "@/components/admin/ModulesAdmin";
import { SubtopicsAdmin } from "@/components/admin/SubtopicsAdmin";
import { FlashcardsAdmin } from "@/components/admin/FlashcardsAdmin";
import { QuizAdmin } from "@/components/admin/QuizAdmin";
import { GlossaryAdmin } from "@/components/admin/GlossaryAdmin";

const sections = [
  { id: "modules", label: "Module", icon: BookOpen },
  { id: "subtopics", label: "Unterthemen", icon: ListTree },
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
        <Button asChild variant="outline">
          <Link to="/dashboard"><Eye className="mr-2 h-4 w-4" /> Lerneransicht</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card-base p-2 self-start lg:sticky lg:top-20">
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

        <div className="space-y-4 min-w-0">
          {section === "modules" && <ModulesAdmin />}
          {section === "subtopics" && <SubtopicsAdmin />}
          {section === "content" && <PdfManager />}
          {section === "flashcards" && <FlashcardsAdmin />}
          {section === "quiz" && <QuizAdmin />}
          {section === "glossary" && <GlossaryAdmin />}
        </div>
      </div>
    </div>
  );
}
