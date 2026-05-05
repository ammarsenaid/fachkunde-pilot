import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Layers, ClipboardCheck, Star, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { useAllProgress } from "@/hooks/useProgress";
import { useModules, useSubtopics } from "@/hooks/useCurriculum";
import type { Status } from "@/data/mock";

const dbToStatus: Record<string, Status> = {
  done: "completed", in_progress: "in_progress", review: "review", not_started: "not_started",
};

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const { data: modules, loading: mLoading } = useModules();
  const { data: list, loading: sLoading } = useSubtopics(moduleId);
  const module = modules.find((m) => m.id === moduleId);
  const { data: progress } = useAllProgress();
  const moduleProg = progress.filter((p) => p.module_id === moduleId);
  const completed = moduleProg.filter((p) => p.status === "done").length;
  const inProg = moduleProg.filter((p) => p.status === "in_progress" || p.status === "review").length;
  const totalSubs = list.length || 1;
  const livePct = Math.min(100, Math.round((completed * 100 + inProg * 40) / totalSubs));

  if (mLoading || sLoading) {
    return <div className="container-page py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent-blue" /></div>;
  }

  if (!module) {
    return (
      <div className="container-page py-12">
        <EmptyState title="Modul nicht gefunden" description="Das gesuchte Modul existiert nicht." action={<Button asChild><Link to="/module">Zurück zu Module</Link></Button>} />
      </div>
    );
  }

  const Icon = (Icons as any)[module.icon] ?? Icons.BookOpen;
  const liveModuleStatus: Status = livePct >= 100 ? "completed" : livePct > 0 ? "in_progress" : "not_started";

  return (
    <div className="container-page py-8">
      <Link to="/module" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Alle Module
      </Link>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue-soft text-accent-blue">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Modul {module.number}</div>
            <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{module.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <StatusBadge status={liveModuleStatus} />
              <span className="inline-flex items-center gap-1"><Layers className="h-4 w-4" /> {list.length} Unterthemen</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> ca. {Math.round(module.estimated_minutes / 60)} h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card-base p-5"><ProgressBar value={livePct} showLabel /></div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Unterthemen</h2>
        {list.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={ClipboardCheck} title="Inhalte folgen" description="Die Unterthemen für dieses Modul werden bald hinzugefügt." />
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {list.map((s, idx) => {
              const row = moduleProg.find((p) => p.subtopic_id === s.id);
              const liveStatus: Status = row ? dbToStatus[row.status] ?? "in_progress" : "not_started";
              return (
                <li key={s.id} className="card-base card-hover p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold">{idx + 1}</div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{s.title}</h3>
                          {s.exam_relevance === 3 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">
                              <Star className="h-3 w-3" /> Hoch prüfungsrelevant
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <StatusBadge status={liveStatus} />
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.reading_minutes} Min</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild className="shrink-0 bg-primary hover:bg-primary-hover">
                      <Link to={`/module/${module.id}/${s.id}`}>Lernen <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
