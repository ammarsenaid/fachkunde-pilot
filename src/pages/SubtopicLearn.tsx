import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Lightbulb, AlertCircle, ScrollText, Languages, CheckCircle2, Layers, ClipboardCheck, Star, StickyNote } from "lucide-react";
import { modules, subtopics } from "@/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SubtopicLearn() {
  const { moduleId, subtopicId } = useParams();
  const module = modules.find((m) => m.id === moduleId);
  const moduleSubs = subtopics.filter((s) => s.moduleId === moduleId);
  const subtopic = moduleSubs.find((s) => s.id === subtopicId) ?? moduleSubs[0];
  const [showArabic, setShowArabic] = useState(false);
  const [checks, setChecks] = useState({ read: false, flashcards: false, quiz: false });

  if (!module || !subtopic) {
    return (
      <div className="container-page py-12">
        <Link to="/module" className="text-accent-blue">← Zurück zu Module</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <Link to={`/module/${module.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {module.title}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Left: subtopic nav */}
        <aside className="hidden lg:block">
          <div className="card-base sticky top-20 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Modul {module.number}</div>
            <div className="mt-1 font-semibold">{module.title}</div>
            <ul className="mt-4 space-y-1">
              {moduleSubs.map((s, i) => (
                <li key={s.id}>
                  <Link
                    to={`/module/${module.id}/${s.id}`}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      s.id === subtopic.id ? "bg-accent-blue-soft text-accent-blue font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span className="mt-0.5 text-xs font-mono opacity-60">{i + 1}.</span>
                    <span className="line-clamp-2">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center: reader */}
        <article className="card-base p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {subtopic.readingMinutes} Min Lesezeit</span>
            {subtopic.examRelevance === 3 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 font-medium text-warning">
                <Star className="h-3 w-3" /> Hoch prüfungsrelevant
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{subtopic.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{subtopic.description}</p>

          {/* Important terms */}
          <div className="mt-6 rounded-2xl border border-border bg-accent-blue-soft/40 p-5">
            <div className="flex items-center gap-2 text-accent-blue">
              <ScrollText className="h-4 w-4" />
              <span className="text-sm font-semibold">Wichtige Begriffe</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Genehmigung", "Konzession", "Beförderungspflicht", "Betriebssitz", "Tarifpflicht"].map((t) => (
                <span key={t} className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border">{t}</span>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="prose prose-slate mt-6 max-w-none text-foreground">
            <p className="leading-relaxed">
              Das Personenbeförderungsgesetz (PBefG) bildet die zentrale rechtliche Grundlage für die entgeltliche
              oder geschäftsmäßige Beförderung von Personen mit Kraftfahrzeugen, Straßenbahnen und Oberleitungsbussen.
              Für Taxi- und Mietwagenunternehmer ist es das wichtigste Gesetz und Prüfungsthema.
            </p>
            <p className="mt-4 leading-relaxed">
              Wer Personen entgeltlich befördern möchte, benötigt eine Genehmigung. Die Genehmigung wird vom Unternehmer
              persönlich beantragt und ist an Voraussetzungen wie persönliche Zuverlässigkeit, finanzielle Leistungsfähigkeit
              und fachliche Eignung geknüpft.
            </p>

            <h2 className="mt-8 text-xl font-semibold">Pflichten des Unternehmers</h2>
            <ul className="mt-3 space-y-2">
              <li>Einhaltung der Beförderungs- und Tarifpflicht im Taxiverkehr</li>
              <li>Sicherstellung der Betriebssicherheit der Fahrzeuge</li>
              <li>Aufzeichnungs- und Aufbewahrungspflichten gegenüber Behörden</li>
              <li>Beachtung der Lenk- und Ruhezeiten der Fahrer</li>
            </ul>
          </div>

          {/* Boxes */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-success-soft/60 p-5">
              <div className="flex items-center gap-2 text-success">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-semibold">Merke dir</span>
              </div>
              <p className="mt-2 text-sm text-foreground">
                Eine PBefG-Genehmigung ist immer personengebunden und betriebsbezogen – sie ist nicht übertragbar.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-warning-soft/60 p-5">
              <div className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Prüfungsrelevant</span>
              </div>
              <p className="mt-2 text-sm text-foreground">
                Die drei Voraussetzungen der Genehmigung – Zuverlässigkeit, Leistungsfähigkeit und fachliche Eignung – werden in fast jeder Prüfung abgefragt.
              </p>
            </div>
          </div>

          {/* Example scenario */}
          <div className="mt-4 rounded-2xl border border-border p-5">
            <div className="text-sm font-semibold text-foreground">Beispielszenario</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ein Mietwagen führt einen Kunden zum Flughafen. Während der Rückfahrt zum Betriebssitz erhält der Fahrer
              per Funk einen neuen Auftrag in der Nähe. Er darf den Auftrag direkt annehmen, da der neue Auftrag
              während der Rückfahrt eingegangen ist – die Rückkehrpflicht wird dadurch ausgesetzt.
            </p>
          </div>

          {/* Arabic toggle */}
          <div className="mt-6">
            <Button variant="outline" onClick={() => setShowArabic((v) => !v)}>
              <Languages className="mr-2 h-4 w-4" />
              {showArabic ? "Arabische Erklärung ausblenden" : "Arabische Erklärung anzeigen"}
            </Button>
            {showArabic && (
              <div className="mt-3 rounded-2xl border border-border bg-secondary/60 p-5 font-arabic text-right" dir="rtl">
                <p className="leading-loose">
                  قانون نقل الأشخاص (PBefG) هو الأساس القانوني الرئيسي لنقل الأشخاص مقابل أجر باستخدام السيارات.
                  يحتاج كل من يرغب في نقل الأشخاص مقابل أجر إلى ترخيص شخصي، مرتبط بشروط مثل الموثوقية الشخصية،
                  والقدرة المالية، والكفاءة المهنية.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Right: tools */}
        <aside className="space-y-4">
          <div className="card-base p-5">
            <h3 className="text-sm font-semibold">Lernfortschritt</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              {([
                ["read", "Gelesen"],
                ["flashcards", "Flashcards gemacht"],
                ["quiz", "Quiz bestanden"],
              ] as const).map(([k, label]) => (
                <li key={k}>
                  <button
                    onClick={() => setChecks((c) => ({ ...c, [k]: !c[k] }))}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    <CheckCircle2 className={cn("h-5 w-5 transition-colors", checks[k] ? "text-success" : "text-muted-foreground/40")} />
                    <span className={checks[k] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-base p-5 space-y-2">
            <Button asChild className="w-full justify-start bg-primary hover:bg-primary-hover">
              <Link to="/flashcards"><Layers className="mr-2 h-4 w-4" /> Flashcards starten</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/pruefung"><ClipboardCheck className="mr-2 h-4 w-4" /> Quiz starten</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" /> Als wichtig markieren
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <StickyNote className="mr-2 h-4 w-4" /> Notiz hinzufügen
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
