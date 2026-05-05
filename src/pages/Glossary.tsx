import { useMemo, useState } from "react";
import { Search, Languages, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlossary } from "@/hooks/useCurriculum";

export default function Glossary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [showAr, setShowAr] = useState(false);
  const { data: glossary, loading } = useGlossary();

  const categories = useMemo(() => ["all", ...Array.from(new Set(glossary.map((g) => g.category)))], [glossary]);
  const filtered = glossary.filter((g) => {
    if (cat !== "all" && g.category !== cat) return false;
    if (q && !(g.term.toLowerCase().includes(q.toLowerCase()) || g.definition.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold tracking-tight">Glossar</h1>
      <p className="text-muted-foreground">Wichtige Begriffe der Fachkundeprüfung – kurz erklärt.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Begriff suchen…" className="pl-9" />
        </div>
        <Button variant={showAr ? "default" : "outline"} onClick={() => setShowAr((v) => !v)} className={showAr ? "bg-primary hover:bg-primary-hover" : ""}>
          <Languages className="mr-2 h-4 w-4" /> Arabisch {showAr ? "an" : "aus"}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cn("rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>
            {c === "all" ? "Alle" : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent-blue" /></div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {filtered.map((g) => (
            <li key={g.id} className="card-base p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{g.term}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{g.category}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{g.definition}</p>
              {showAr && g.arabic && (
                <p className="mt-3 rounded-xl bg-secondary/60 p-3 font-arabic text-right text-sm leading-loose" dir="rtl">{g.arabic}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && filtered.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">Keine Begriffe gefunden.</div>
      )}
    </div>
  );
}
