import { Link } from "react-router-dom";
import { Bookmark, StickyNote, Layers, AlertCircle, BookMarked, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "bookmarks", label: "Wichtige Themen", icon: Bookmark },
  { id: "notes", label: "Notizen", icon: StickyNote },
  { id: "hard", label: "Schwierige Karten", icon: Layers },
  { id: "wrong", label: "Falsche Quizfragen", icon: AlertCircle },
  { id: "terms", label: "Gespeicherte Begriffe", icon: BookMarked },
] as const;

const notes = [
  { id: 1, title: "Genehmigungsverfahren", content: "Die Konzession ist immer personengebunden – nicht übertragbar. Wichtig für die Prüfung!", module: "Rechtliche Grundlagen", date: "vor 2 Tagen" },
  { id: 2, title: "Rückkehrpflicht Mietwagen", content: "Ausnahme: neuer Auftrag während der Rückfahrt → darf direkt angenommen werden.", module: "Personenbeförderungsgesetz", date: "vor 4 Tagen" },
];

const bookmarks = [
  { title: "Unternehmerpflichten", module: "Rechtliche Grundlagen", href: "/module/rechtliche-grundlagen/unternehmerpflichten" },
  { title: "Beförderungspflicht §47 PBefG", module: "PBefG", href: "/module/pbefg/pbefg-taxiverkehr" },
  { title: "Lenk- und Ruhezeiten", module: "Arbeitsrecht", href: "/module/arbeitsrecht" },
];

export default function Notes() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("bookmarks");

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold tracking-tight">Notizen & Lesezeichen</h1>
      <p className="text-muted-foreground">Alles, was du dir gemerkt hast – an einem Ort.</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors -mb-px",
                active ? "border-accent-blue text-accent-blue" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "bookmarks" && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {bookmarks.map((b) => (
              <li key={b.title}>
                <Link to={b.href} className="card-base card-hover flex items-center justify-between p-5">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">{b.module}</div>
                    <div className="mt-0.5 font-semibold">{b.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {tab === "notes" && (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="card-base p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{n.title}</h3>
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{n.content}</p>
                <div className="mt-3 inline-flex rounded-full bg-accent-blue-soft px-2.5 py-0.5 text-xs font-medium text-accent-blue">{n.module}</div>
              </li>
            ))}
          </ul>
        )}

        {(tab === "hard" || tab === "wrong" || tab === "terms") && (
          <EmptyState
            icon={tabs.find((t) => t.id === tab)!.icon}
            title="Noch nichts gespeichert"
            description="Markiere Karten, Fragen oder Begriffe beim Lernen, damit sie hier erscheinen."
            action={<Button asChild><Link to="/module">Zum Lernen starten</Link></Button>}
          />
        )}
      </div>
    </div>
  );
}
