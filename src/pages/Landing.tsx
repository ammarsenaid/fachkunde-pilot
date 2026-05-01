import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, Layers, Calendar, Smartphone, Languages, Trophy, Sparkles, BookOpen, ClipboardCheck, Brain, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { modules } from "@/data/mock";

const benefits = [
  { icon: Calendar, title: "Strukturierter Lernplan", desc: "Klar geplante Wochen bis zu deiner Prüfung." },
  { icon: Layers, title: "Karteikarten", desc: "Wiederholung mit Spaced-Repetition-Logik." },
  { icon: ClipboardCheck, title: "Prüfungssimulation", desc: "Realistische Prüfungen mit Auswertung." },
  { icon: Trophy, title: "Fortschrittsanzeige", desc: "Sieh genau, wo du stehst und was fehlt." },
  { icon: Smartphone, title: "Mobil optimiert", desc: "Lerne überall – im Auto, in der Pause, zu Hause." },
  { icon: Languages, title: "Arabische Erklärungen", desc: "Deutsch zuerst, mit optionalen arabischen Hilfen." },
];

const steps = [
  { n: 1, icon: BookOpen, title: "Modul auswählen", desc: "Wähle eines von 12 Prüfungsmodulen." },
  { n: 2, icon: Sparkles, title: "Unterthema lesen", desc: "Kompakte, prüfungsrelevante Texte." },
  { n: 3, icon: Brain, title: "Flashcards üben", desc: "Festige dein Wissen mit Karteikarten." },
  { n: 4, icon: ClipboardCheck, title: "Quiz beantworten", desc: "Teste dich am Ende jedes Themas." },
  { n: 5, icon: Trophy, title: "Prüfung simulieren", desc: "Bereite dich realistisch auf den Prüfungstag vor." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">Fachkunde</span>
              <span className="text-[11px] text-muted-foreground">Taxi & Mietwagen</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Anmelden</Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover">
              <Link to="/dashboard">Jetzt lernen</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(214 90% 70% / 0.4), transparent 40%), radial-gradient(circle at 80% 60%, hsl(142 71% 50% / 0.25), transparent 40%)" }} />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> IHK-Prüfungsvorbereitung
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Bestehe deine Taxi- und Mietwagen-Fachkundeprüfung mit System
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
              Lerne Schritt für Schritt mit Modulen, Unterthemen, Zusammenfassungen, Flashcards und Prüfungssimulationen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent-blue hover:bg-accent-blue/90 text-accent-blue-foreground">
                <Link to="/dashboard">Jetzt lernen <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                <Link to="/module"><Play className="mr-2 h-4 w-4" /> Demo ansehen</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> 12 Prüfungsmodule</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> 500+ Karteikarten</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Mock-Prüfungen</span>
            </div>
          </div>

          {/* Hero card preview */}
          <div className="relative animate-fade-in">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md ring-1 ring-white/15">
              <div className="rounded-xl bg-card p-6 text-card-foreground shadow-lifted">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Modul 2</div>
                    <div className="mt-0.5 font-semibold">Personenbeförderungsgesetz</div>
                  </div>
                  <span className="rounded-full bg-info-soft px-2.5 py-1 text-xs font-medium text-accent-blue">In Bearbeitung</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-gradient-progress" />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground"><span>Fortschritt</span><span className="font-medium text-foreground">68%</span></div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="text-lg font-bold">24</div>
                    <div className="text-[10px] text-muted-foreground">Karteikarten</div>
                  </div>
                  <div className="rounded-lg bg-success-soft p-3">
                    <div className="text-lg font-bold text-success">87%</div>
                    <div className="text-[10px] text-muted-foreground">Quiz-Score</div>
                  </div>
                  <div className="rounded-lg bg-warning-soft p-3">
                    <div className="text-lg font-bold text-warning">3</div>
                    <div className="text-[10px] text-muted-foreground">Schwach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Alles, was du zum Bestehen brauchst</h2>
          <p className="mt-3 text-muted-foreground">Eine Lernumgebung, die für die deutsche Taxi- und Mietwagen-Fachkundeprüfung gebaut wurde.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card-base card-hover p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue-soft text-accent-blue">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules overview */}
      <section className="bg-secondary/40 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Die 12 Prüfungsmodule</h2>
            <p className="mt-3 text-muted-foreground">Alle prüfungsrelevanten Themen, klar strukturiert.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.id} className="card-base flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {m.number}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">{m.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.subtopicCount} Themen · {Math.round(m.estimatedMinutes / 60)} h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">So lernst du in 5 Schritten</h2>
          <p className="mt-3 text-muted-foreground">Ein einfacher, wiederholbarer Lernablauf.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="card-base relative p-5">
              <div className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{s.n}</div>
              <s.icon className="mt-2 h-6 w-6 text-accent-blue" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground sm:p-14">
          <h2 className="text-3xl font-bold sm:text-4xl">Bereit für deine Prüfung?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Starte heute und lerne strukturiert mit der Plattform für angehende Taxi- und Mietwagenunternehmer.</p>
          <Button asChild size="lg" className="mt-6 bg-accent-blue hover:bg-accent-blue/90">
            <Link to="/dashboard">Jetzt lernen <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            © {new Date().getFullYear()} Fachkunde Lernplattform
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Impressum</a>
            <a href="#" className="hover:text-foreground">Datenschutz</a>
            <a href="#" className="hover:text-foreground">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
