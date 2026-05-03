import { Link } from "react-router-dom";
import { Flame, Target, BookOpen, Layers, ClipboardCheck, TrendingUp, ArrowRight, Calendar, GraduationCap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { modules, subtopics } from "@/data/mock";
import { useAllProgress } from "@/hooks/useProgress";
import { useFlashcardReviews } from "@/hooks/useFlashcardReviews";
import { useQuizAttempts } from "@/hooks/useQuizAttempts";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { profile } = useAuth();
  const { data: progress } = useAllProgress();
  const { dueCount } = useFlashcardReviews();
  const { attempts } = useQuizAttempts();

  const moduleProgress = modules.map((m) => {
    const subs = subtopics.filter((s) => s.moduleId === m.id);
    const total = subs.length || m.subtopicCount || 1;
    const moduleRows = progress.filter((p) => p.module_id === m.id);
    const done = moduleRows.filter((p) => p.status === "done").length;
    const inProg = moduleRows.filter((p) => p.status === "in_progress" || p.status === "review").length;
    const pct = Math.min(100, Math.round((done * 100 + inProg * 40) / total));
    const status: "completed" | "in_progress" | "review" | "not_started" =
      pct >= 100 ? "completed" : moduleRows.some((r) => r.status === "review") ? "review" : pct > 0 ? "in_progress" : "not_started";
    return { ...m, progress: pct, status };
  });
  const current = moduleProgress.find((m) => m.status === "in_progress") ?? moduleProgress.find((m) => m.status !== "completed") ?? moduleProgress[0];
  const overall = Math.round(moduleProgress.reduce((sum, m) => sum + m.progress, 0) / moduleProgress.length);
  const lastAttempt = attempts[0];
  const lastPct = lastAttempt ? Math.round((lastAttempt.score / Math.max(1, lastAttempt.total)) * 100) : null;
  const goal = profile?.daily_goal_minutes ?? 30;

  return (
    <div className="container-page py-8">
      {/* Welcome */}
      <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/70">Willkommen zurück 👋</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Lass uns weiterlernen</h1>
            <p className="mt-2 max-w-xl text-primary-foreground/80">Du hast diese Woche bereits viel geschafft. Halte den Schwung – nur noch wenige Module bis zur Prüfungsreife.</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="text-sm text-primary-foreground/70">Gesamtfortschritt</div>
            <div className="text-4xl font-bold">{overall}%</div>
            <Button asChild size="lg" className="bg-accent-blue hover:bg-accent-blue/90">
              <Link to={`/module/${current.id}`}>Weiterlernen <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Heutiges Lernziel" value="45 Min" hint="22 / 45 Min erledigt" icon={Target} tone="info" />
        <DashboardStatCard label="Lernstreak" value="7 Tage" hint="Weiter so 🔥" icon={Flame} tone="warning" />
        <DashboardStatCard label="Karteikarten heute" value={18} hint="zur Wiederholung fällig" icon={Layers} tone="default" />
        <DashboardStatCard label="Letzte Mock-Prüfung" value="78%" hint="bestanden – Ziel: 75%" icon={GraduationCap} tone="success" />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Current module */}
        <div className="card-base p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Aktuelles Modul</h2>
            <Link to="/module" className="text-sm font-medium text-accent-blue hover:underline">Alle Module</Link>
          </div>
          <div className="mt-4 rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Modul {current.number}</div>
                <h3 className="mt-1 text-xl font-semibold">{current.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{current.description}</p>
              </div>
              <BookOpen className="h-6 w-6 text-accent-blue" />
            </div>
            <div className="mt-4">
              <ProgressBar value={current.progress} showLabel />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-primary hover:bg-primary-hover">
                <Link to={`/module/${current.id}`}>Weiterlernen</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/flashcards">Flashcards üben</Link>
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <h2 className="mt-8 text-lg font-semibold">Schnellzugriff</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { to: "/module", label: "Weiterlernen", icon: BookOpen, tone: "bg-accent-blue-soft text-accent-blue" },
              { to: "/flashcards", label: "Flashcards üben", icon: Layers, tone: "bg-success-soft text-success" },
              { to: "/pruefung", label: "Prüfung starten", icon: ClipboardCheck, tone: "bg-warning-soft text-warning" },
              { to: "/lernplan", label: "Lernplan ansehen", icon: Calendar, tone: "bg-secondary text-foreground" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="card-base card-hover flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${q.tone}`}>
                    <q.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{q.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <div className="card-base p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="text-base font-semibold">Schwächen</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Diese Themen brauchen Wiederholung.</p>
            <ul className="mt-4 space-y-3">
              {modules.filter((m) => m.status === "review").concat(modules.filter((m) => m.progress > 0 && m.progress < 50)).slice(0, 3).map((m) => (
                <li key={m.id}>
                  <Link to={`/module/${m.id}`} className="flex items-center justify-between gap-2 rounded-lg p-2 -mx-2 hover:bg-secondary">
                    <span className="truncate text-sm font-medium">{m.title}</span>
                    <span className="text-xs text-warning">{m.progress}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h2 className="text-base font-semibold">Heutiges Ziel</h2>
            </div>
            <div className="mt-4">
              <ProgressBar value={49} showLabel />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" /> 1 Unterthema lesen</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" /> 15 Karteikarten wiederholen</li>
              <li className="flex items-center gap-2 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> 1 Quiz beantworten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
