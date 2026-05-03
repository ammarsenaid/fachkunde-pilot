import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Star, Languages, ClipboardCheck, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizQuestions, modules } from "@/data/mock";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { Link } from "react-router-dom";
import { useQuizAttempts } from "@/hooks/useQuizAttempts";

type Phase = "intro" | "playing" | "result";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const questions = useMemo(
    () => (moduleFilter === "all" ? quizQuestions : quizQuestions.filter((q) => q.moduleId === moduleFilter)),
    [moduleFilter]
  );
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAr, setShowAr] = useState(false);
  const [answers, setAnswers] = useState<Array<{ qid: string; correct: boolean; selected: number }>>([]);
  const startedAtRef = useRef<number>(Date.now());
  const { save } = useQuizAttempts();
  const savedRef = useRef(false);

  const total = questions.length;
  const q = questions[idx];
  const score = answers.filter((a) => a.correct).length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= 75;

  function start() {
    setPhase("playing");
    setIdx(0); setSelected(null); setAnswers([]); setShowAr(false);
    startedAtRef.current = Date.now();
    savedRef.current = false;
  }

  function submit() {
    if (selected === null) return;
    setAnswers((a) => [...a, { qid: q.id, correct: selected === q.correctIndex, selected }]);
  }

  function next() {
    if (idx + 1 >= total) setPhase("result");
    else { setIdx((i) => i + 1); setSelected(null); setShowAr(false); }
  }

  useEffect(() => {
    if (phase === "result" && !savedRef.current && total > 0) {
      savedRef.current = true;
      void save({
        module_id: moduleFilter === "all" ? null : moduleFilter,
        score, total, duration_seconds: Math.round((Date.now() - startedAtRef.current) / 1000),
        answers,
      });
    }
  }, [phase, total, score, moduleFilter, answers, save]);

  if (phase === "intro") {
    return (
      <div className="container-page py-8">
        <h1 className="text-3xl font-bold tracking-tight">Prüfungssimulation</h1>
        <p className="text-muted-foreground">Teste dein Wissen unter prüfungsähnlichen Bedingungen.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card-base p-6 lg:col-span-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Mock-Prüfung starten</h2>
            <p className="mt-2 text-muted-foreground">
              Beantworte alle Fragen, danach erhältst du eine vollständige Auswertung mit Schwächenanalyse.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-secondary p-4">
                <div className="text-xs text-muted-foreground">Fragen</div>
                <div className="mt-1 text-2xl font-bold">{total}</div>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <div className="text-xs text-muted-foreground">Zeit</div>
                <div className="mt-1 text-2xl font-bold">~{total * 2} Min</div>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <div className="text-xs text-muted-foreground">Bestehensgrenze</div>
                <div className="mt-1 text-2xl font-bold">75%</div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium">Modul auswählen</label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
              >
                <option value="all">Alle Module (komplette Prüfung)</option>
                {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>

            <Button size="lg" className="mt-6 bg-primary hover:bg-primary-hover" onClick={start}>
              Prüfung starten <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="card-base p-6">
            <h3 className="font-semibold">Hinweise</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li>• Eine richtige Antwort pro Frage</li>
              <li>• Erklärung nach jeder Antwort</li>
              <li>• Optionale arabische Erklärung</li>
              <li>• Wiederhole am Ende falsche Fragen</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const wrongModules = answers
      .map((a, i) => (!a.correct ? questions[i].moduleId : null))
      .filter(Boolean) as string[];
    const weakModules = Array.from(new Set(wrongModules))
      .map((id) => modules.find((m) => m.id === id))
      .filter(Boolean);

    return (
      <div className="container-page py-8">
        <div className="mx-auto max-w-3xl">
          <div className="card-base p-8 text-center">
            <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-2xl", passed ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-3xl font-bold">{passed ? "Bestanden 🎉" : "Noch nicht bestanden"}</h1>
            <p className="mt-2 text-muted-foreground">Du hast {score} von {total} Fragen richtig beantwortet.</p>
            <div className="mx-auto mt-6 max-w-sm">
              <ProgressBar value={percent} size="lg" variant={passed ? "success" : "default"} />
              <div className="mt-2 text-2xl font-bold">{percent}%</div>
            </div>
          </div>

          {weakModules.length > 0 && (
            <div className="card-base mt-6 p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h2 className="font-semibold">Schwächen-Analyse</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {weakModules.map((m) => (
                  <li key={m!.id} className="flex items-center justify-between rounded-lg bg-warning-soft/40 px-3 py-2 text-sm">
                    <span className="font-medium">{m!.title}</span>
                    <Link to={`/module/${m!.id}`} className="text-accent-blue hover:underline">Wiederholen</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={start} className="bg-primary hover:bg-primary-hover">
              <RotateCcw className="mr-2 h-4 w-4" /> Falsche Antworten wiederholen
            </Button>
            <Button asChild variant="outline">
              <Link to="/lernplan">Lernplan anpassen</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // playing
  const submitted = answers.length > idx;
  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Frage {idx + 1} / {total}</span>
          <span>Score: <span className="font-semibold text-foreground">{score}</span></span>
        </div>
        <div className="mt-2"><ProgressBar value={((idx + (submitted ? 1 : 0)) / total) * 100} /></div>

        <div className="card-base mt-6 p-6 sm:p-8">
          <h2 className="text-xl font-semibold leading-snug">{q.question}</h2>

          <div className="mt-6 space-y-2.5">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correctIndex;
              const showState = submitted;
              return (
                <button
                  key={i}
                  disabled={submitted}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    !showState && isSelected && "border-accent-blue bg-accent-blue-soft",
                    !showState && !isSelected && "border-border hover:border-accent-blue/50 hover:bg-secondary",
                    showState && isCorrect && "border-success bg-success-soft text-foreground",
                    showState && !isCorrect && isSelected && "border-destructive bg-destructive-soft",
                    showState && !isCorrect && !isSelected && "border-border opacity-60",
                  )}
                >
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    !showState && isSelected ? "bg-accent-blue text-accent-blue-foreground" : "bg-secondary text-muted-foreground",
                    showState && isCorrect && "bg-success text-success-foreground",
                    showState && !isCorrect && isSelected && "bg-destructive text-destructive-foreground",
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-sm sm:text-base">{opt}</span>
                  {showState && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {showState && !isCorrect && isSelected && <XCircle className="h-5 w-5 text-destructive" />}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-6 rounded-2xl border border-border bg-info-soft p-5 animate-fade-in">
              <div className="text-sm font-semibold text-accent-blue">Erklärung</div>
              <p className="mt-2 text-sm text-foreground">{q.explanation}</p>
              {q.arabicExplanation && (
                <>
                  <Button size="sm" variant="ghost" className="mt-3 h-8 px-2 text-accent-blue hover:bg-accent-blue/10" onClick={() => setShowAr((v) => !v)}>
                    <Languages className="mr-1.5 h-3.5 w-3.5" /> {showAr ? "Arabisch ausblenden" : "Arabische Erklärung"}
                  </Button>
                  {showAr && (
                    <div className="mt-2 rounded-xl bg-card p-3 font-arabic text-right text-sm leading-loose" dir="rtl">
                      {q.arabicExplanation}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" size="sm">
              <Star className="mr-1.5 h-4 w-4" /> Als wichtig markieren
            </Button>
            {!submitted ? (
              <Button onClick={submit} disabled={selected === null} className="bg-primary hover:bg-primary-hover">
                Antwort prüfen
              </Button>
            ) : (
              <Button onClick={next} className="bg-primary hover:bg-primary-hover">
                {idx + 1 >= total ? "Auswertung ansehen" : "Nächste Frage"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
