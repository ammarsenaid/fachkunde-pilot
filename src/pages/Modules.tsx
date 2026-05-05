import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { Input } from "@/components/ui/input";
import { useModules } from "@/hooks/useCurriculum";
import { useSubtopics } from "@/hooks/useCurriculum";
import { useAllProgress } from "@/hooks/useProgress";

export default function Modules() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed" | "not_started">("all");
  const { data: modules, loading } = useModules();
  const { data: subtopics } = useSubtopics();
  const { data: progress } = useAllProgress();

  const enriched = modules.map((m) => {
    const subs = subtopics.filter((s) => s.module_id === m.id);
    const total = subs.length || 1;
    const rows = progress.filter((p) => p.module_id === m.id);
    const done = rows.filter((p) => p.status === "done").length;
    const inProg = rows.filter((p) => p.status === "in_progress" || p.status === "review").length;
    const pct = Math.min(100, Math.round((done * 100 + inProg * 40) / total));
    const status: "completed" | "in_progress" | "review" | "not_started" =
      pct >= 100 ? "completed" : rows.some((r) => r.status === "review") ? "review" : pct > 0 ? "in_progress" : "not_started";
    return {
      id: m.id, number: m.number, title: m.title, description: m.description,
      icon: m.icon, subtopicCount: subs.length, estimatedMinutes: m.estimated_minutes,
      progress: pct, status,
    };
  });

  const filtered = enriched.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (q && !m.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const filters = [
    { id: "all", label: "Alle" },
    { id: "in_progress", label: "In Bearbeitung" },
    { id: "completed", label: "Abgeschlossen" },
    { id: "not_started", label: "Nicht begonnen" },
  ] as const;

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Lernmodule</h1>
        <p className="text-muted-foreground">{modules.length} Module – alles, was für die Fachkundeprüfung relevant ist.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Modul suchen…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent-blue" /></div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => <ModuleCard key={m.id} module={m as any} />)}
        </div>
      )}
    </div>
  );
}
