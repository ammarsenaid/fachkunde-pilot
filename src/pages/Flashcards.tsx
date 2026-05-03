import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flashcards, modules } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useFlashcardReviews } from "@/hooks/useFlashcardReviews";

export default function FlashcardsPage() {
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const { rate, dueCount } = useFlashcardReviews();
  const cards = useMemo(
    () => (moduleFilter === "all" ? flashcards : flashcards.filter((c) => c.moduleId === moduleFilter)),
    [moduleFilter]
  );
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ knew: 0, unsure: 0, missed: 0 });

  const card = cards[idx % cards.length];

  async function handleRate(kind: "knew" | "unsure" | "missed") {
    setStats((s) => ({ ...s, [kind]: s[kind] + 1 }));
    setFlipped(false);
    await rate(card.id, card.moduleId, kind);
    setIdx((i) => i + 1);
  }

  function reset() {
    setStats({ knew: 0, unsure: 0, missed: 0 });
    setIdx(0);
    setFlipped(false);
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-muted-foreground">Tägliche Wiederholung – {dueCount} Karten heute fällig.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={moduleFilter}
            onChange={(e) => { setModuleFilter(e.target.value); setIdx(0); setFlipped(false); }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="all">Alle Module</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card-base p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Wusste ich</div>
          <div className="mt-1 text-2xl font-bold text-success">{stats.knew}</div>
        </div>
        <div className="card-base p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Unsicher</div>
          <div className="mt-1 text-2xl font-bold text-warning">{stats.unsure}</div>
        </div>
        <div className="card-base p-4 text-center">
          <div className="text-xs font-medium text-muted-foreground">Nicht gewusst</div>
          <div className="mt-1 text-2xl font-bold text-destructive">{stats.missed}</div>
        </div>
      </div>

      {/* Card */}
      <div className="mt-8 mx-auto max-w-2xl">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Karte {(idx % cards.length) + 1} / {cards.length}</span>
          <span className="capitalize">Schwierigkeit: <span className="font-medium text-foreground">{card.difficulty}</span></span>
        </div>

        <button
          onClick={() => setFlipped((f) => !f)}
          className="group relative w-full text-left"
        >
          <div className={cn(
            "card-base flex min-h-[260px] w-full flex-col justify-between p-8 transition-all duration-300 sm:min-h-[320px]",
            flipped ? "bg-primary text-primary-foreground" : "bg-card"
          )}>
            <div className="text-xs font-medium uppercase tracking-wider opacity-70">{flipped ? "Antwort" : "Frage"}</div>
            <div className="my-6 text-xl font-medium leading-relaxed sm:text-2xl">
              {flipped ? card.back : card.front}
            </div>
            {flipped && card.arabicHint && (
              <div className="mt-2 rounded-xl bg-white/10 p-3 font-arabic text-right text-base leading-loose" dir="rtl">
                {card.arabicHint}
              </div>
            )}
            <div className="mt-4 text-xs opacity-70">Klicken zum Umdrehen</div>
          </div>
        </button>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive-soft hover:text-destructive" onClick={() => handleRate("missed")}>
            Nicht gewusst
          </Button>
          <Button variant="outline" className="border-warning/30 text-warning hover:bg-warning-soft hover:text-warning" onClick={() => handleRate("unsure")}>
            Unsicher
          </Button>
          <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleRate("knew")}>
            Wusste ich
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => { setFlipped(false); setIdx((i) => Math.max(0, i - 1)); }}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Zurück
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Neu starten
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setFlipped(false); setIdx((i) => i + 1); }}>
            Weiter <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="outline">Tägliche Wiederholung</Button>
          <Button variant="outline">Schwierige Karten wiederholen</Button>
        </div>
      </div>
    </div>
  );
}
