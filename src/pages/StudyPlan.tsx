import { useState } from "react";
import { Calendar, CheckCircle2, Circle, BookOpen, Layers, ClipboardCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { Input } from "@/components/ui/input";
import { modules } from "@/data/mock";
import { cn } from "@/lib/utils";

const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

const taskIcons = { read: BookOpen, flashcards: Layers, quiz: ClipboardCheck, review: RotateCcw } as const;
type TaskKind = keyof typeof taskIcons;

interface Task { kind: TaskKind; label: string; done?: boolean }

const week: { day: string; date: string; tasks: Task[] }[] = days.map((day, i) => ({
  day,
  date: `${15 + i}. Mai`,
  tasks: [
    { kind: "read", label: `${modules[i % modules.length].title}: 1 Unterthema`, done: i < 2 },
    { kind: "flashcards", label: "15 Karteikarten", done: i < 2 },
    ...(i % 2 === 0 ? [{ kind: "quiz" as TaskKind, label: "Quiz beantworten", done: i === 0 }] : []),
    ...(i === 6 ? [{ kind: "review" as TaskKind, label: "Wochenreview" }] : []),
  ],
}));

export default function StudyPlan() {
  const [examDate, setExamDate] = useState("2026-06-15");
  const totalTasks = week.reduce((s, d) => s + d.tasks.length, 0);
  const doneTasks = week.reduce((s, d) => s + d.tasks.filter((t) => t.done).length, 0);
  const percent = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Lernplan</h1>
        <p className="text-muted-foreground">Dein persönlicher Wochenplan – auf deinen Prüfungstermin abgestimmt.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Week view */}
        <div className="space-y-3">
          {week.map((d, i) => {
            const dayPercent = d.tasks.length ? Math.round((d.tasks.filter((t) => t.done).length / d.tasks.length) * 100) : 0;
            const isToday = i === 2;
            return (
              <div key={d.day} className={cn("card-base p-5", isToday && "ring-2 ring-accent-blue")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{d.day}</h3>
                      {isToday && <span className="rounded-full bg-accent-blue px-2 py-0.5 text-[10px] font-bold uppercase text-accent-blue-foreground">Heute</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{d.date}</div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{dayPercent}%</div>
                </div>
                <div className="mt-3"><ProgressBar value={dayPercent} size="sm" /></div>

                <ul className="mt-4 space-y-2">
                  {d.tasks.map((t, ti) => {
                    const Icon = taskIcons[t.kind];
                    return (
                      <li key={ti} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2.5">
                        {t.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground/50" />}
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className={cn("text-sm flex-1", t.done && "line-through text-muted-foreground")}>{t.label}</span>
                      </li>
                    );
                  })}
                </ul>

                {isToday && (
                  <Button className="mt-4 bg-primary hover:bg-primary-hover">Heute lernen</Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card-base p-5">
            <div className="flex items-center gap-2 text-accent-blue">
              <Calendar className="h-4 w-4" />
              <h3 className="text-sm font-semibold text-foreground">Prüfungstermin</h3>
            </div>
            <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="mt-3" />
            <div className="mt-3 text-xs text-muted-foreground">Plan wird automatisch angepasst.</div>
          </div>

          <div className="card-base p-5">
            <h3 className="text-sm font-semibold">Wochenfortschritt</h3>
            <div className="mt-3"><ProgressBar value={percent} showLabel /></div>
            <div className="mt-3 text-sm text-muted-foreground">{doneTasks} von {totalTasks} Aufgaben erledigt</div>
          </div>

          <div className="card-base p-5">
            <h3 className="text-sm font-semibold">Modulverteilung</h3>
            <ul className="mt-3 space-y-2.5">
              {modules.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold">{m.number}</span>
                  <span className="truncate">{m.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
