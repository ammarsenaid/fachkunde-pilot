import { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  RefreshCw,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePdfDocuments,
  usePdfPages,
  useContentMappings,
  type PdfDocument,
} from "@/hooks/usePdfDocuments";
import { useModules, useSubtopics } from "@/hooks/useCurriculum";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

const statusStyles: Record<string, { label: string; className: string; icon: any }> = {
  uploaded: { label: "Hochgeladen", className: "bg-secondary text-foreground", icon: FileText },
  processing: { label: "Wird verarbeitet…", className: "bg-accent-blue-soft text-accent-blue", icon: Loader2 },
  ready: { label: "Bereit", className: "bg-success/15 text-success", icon: Check },
  failed: { label: "Fehlgeschlagen", className: "bg-destructive/15 text-destructive", icon: AlertCircle },
};

export function PdfManager() {
  const { documents, loading, uploadPdf, removeDocument, reprocess, refresh } =
    usePdfDocuments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedDoc = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId]
  );

  const onFile = async (file?: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return;
    }
    setUploading(true);
    const doc = await uploadPdf(file);
    setUploading(false);
    if (doc) setSelectedId(doc.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">PDFs & Inhalte</h2>
          <p className="text-sm text-muted-foreground">
            PDF hochladen, Text wird automatisch extrahiert, dann Abschnitte Modulen zuordnen.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="mr-1.5 h-4 w-4" /> Aktualisieren
        </Button>
      </div>

      {/* Upload zone */}
      <div
        className={cn(
          "card-base relative cursor-pointer p-8 text-center transition-colors",
          "border-2 border-dashed border-border hover:border-primary/40 hover:bg-secondary/40",
          uploading && "pointer-events-none opacity-70"
        )}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        {uploading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        )}
        <div className="mt-3 text-sm font-medium">
          {uploading ? "Wird hochgeladen…" : "PDF hierher ziehen oder klicken"}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Wird privat gespeichert und automatisch in Seiten zerlegt.
        </p>
      </div>

      {/* Documents list */}
      <div className="card-base divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium">Dokumente</div>
          <div className="text-xs text-muted-foreground">
            {documents.length} insgesamt
          </div>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Lade…</div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            Noch keine PDFs hochgeladen.
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              selected={doc.id === selectedId}
              onSelect={() => setSelectedId(doc.id)}
              onRemove={() => removeDocument(doc)}
              onReprocess={() => reprocess(doc)}
            />
          ))
        )}
      </div>

      {/* Mapping panel */}
      {selectedDoc && <MappingPanel doc={selectedDoc} />}
    </div>
  );
}

function DocumentRow({
  doc,
  selected,
  onSelect,
  onRemove,
  onReprocess,
}: {
  doc: PdfDocument;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onReprocess: () => void;
}) {
  const s = statusStyles[doc.status] ?? statusStyles.uploaded;
  const Icon = s.icon;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 px-4 py-3 transition-colors",
        selected ? "bg-accent-blue-soft/40" : "hover:bg-secondary/40"
      )}
    >
      <div className="flex flex-1 items-center gap-3">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{doc.filename}</div>
          <div className="text-xs text-muted-foreground">
            {doc.page_count > 0 ? `${doc.page_count} Seiten · ` : ""}
            {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: de })}
            {doc.error_message ? ` · ${doc.error_message}` : ""}
          </div>
        </div>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
          s.className
        )}
      >
        <Icon className={cn("h-3 w-3", doc.status === "processing" && "animate-spin")} />
        {s.label}
      </span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={onSelect}>
          <Eye className="mr-1.5 h-4 w-4" /> Öffnen
        </Button>
        <Button size="sm" variant="ghost" onClick={onReprocess}>
          <RefreshCw className="mr-1.5 h-4 w-4" /> Neu extrahieren
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MappingPanel({ doc }: { doc: PdfDocument }) {
  const { pages, loading } = usePdfPages(doc.id);
  const { mappings, create, remove } = useContentMappings(doc.id);
  const { data: modules } = useModules();

  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string>("");
  const [subtopicId, setSubtopicId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [chunk, setChunk] = useState("");

  // default module once loaded
  if (!moduleId && modules[0]) setTimeout(() => setModuleId(modules[0].id), 0);

  const { data: moduleSubtopics } = useSubtopics(moduleId || undefined);
  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0] ?? null;

  const handleSelectPage = (pageId: string) => {
    setActivePageId(pageId);
    const p = pages.find((pp) => pp.id === pageId);
    if (p) {
      setChunk(p.content.slice(0, 1500));
      setTitle(`Seite ${p.page_number}`);
    }
  };

  const handleAssign = async () => {
    if (!chunk.trim() || !moduleId) return;
    await create({
      document_id: doc.id,
      page_id: activePage?.id ?? null,
      module_id: moduleId,
      subtopic_id: subtopicId || null,
      title: title || null,
      chunk_text: chunk,
    });
    setChunk("");
    setTitle("");
  };

  return (
    <div className="card-base p-0">
      <div className="border-b border-border px-4 py-3">
        <div className="text-sm font-medium">{doc.filename}</div>
        <div className="text-xs text-muted-foreground">
          Wähle eine Seite, markiere den Text und ordne ihn einem Modul zu.
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_1fr_320px]">
        {/* Page list */}
        <div className="max-h-[520px] overflow-auto border-b border-border lg:border-b-0 lg:border-r">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Lade Seiten…</div>
          ) : pages.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              {doc.status === "ready"
                ? "Keine Seiten gefunden."
                : "Warte auf Extraktion…"}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {pages.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => handleSelectPage(p.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors",
                      activePage?.id === p.id
                        ? "bg-accent-blue-soft text-accent-blue"
                        : "hover:bg-secondary"
                    )}
                  >
                    <span className="font-medium">Seite {p.page_number}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {p.content.slice(0, 32)}…
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Page content + chunk editor */}
        <div className="flex min-h-[520px] flex-col p-4">
          {activePage ? (
            <>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Seite {activePage.page_number}
              </div>
              <div className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-secondary/30 p-3 text-sm leading-relaxed">
                {activePage.content || "(leer)"}
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Auszug bearbeiten
              </div>
              <textarea
                value={chunk}
                onChange={(e) => setChunk(e.target.value)}
                className="mt-2 min-h-[160px] w-full flex-1 rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Markiere den relevanten Abschnitt für das Modul…"
              />
            </>
          ) : (
            <div className="m-auto text-sm text-muted-foreground">
              Wähle links eine Seite aus.
            </div>
          )}
        </div>

        {/* Assign panel */}
        <div className="space-y-3 border-t border-border p-4 lg:border-l lg:border-t-0">
          <div className="text-sm font-semibold">Zuordnen</div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Titel</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Genehmigungspflicht §2"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Modul</label>
            <Select
              value={moduleId}
              onValueChange={(v) => {
                setModuleId(v);
                setSubtopicId("");
              }}
            >
              <SelectTrigger><SelectValue placeholder="Modul wählen" /></SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.number}. {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Unterthema (optional)
            </label>
            <Select value={subtopicId || "none"} onValueChange={(v) => setSubtopicId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Keine —</SelectItem>
                {moduleSubtopics.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary-hover"
            disabled={!chunk.trim()}
            onClick={handleAssign}
          >
            <ArrowRight className="mr-1.5 h-4 w-4" /> Zuweisen
          </Button>

          <div className="pt-3">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Bisherige Zuordnungen ({mappings.length})
            </div>
            <div className="max-h-56 space-y-2 overflow-auto">
              {mappings.length === 0 ? (
                <div className="text-xs text-muted-foreground">Noch keine.</div>
              ) : (
                mappings.map((m) => {
                  const mod = modules.find((x) => x.id === m.module_id);
                  const sub = subtopics.find((x) => x.id === m.subtopic_id);
                  return (
                    <div
                      key={m.id}
                      className="rounded-lg border border-border bg-background p-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {m.title || "Ohne Titel"}
                          </div>
                          <div className="truncate text-muted-foreground">
                            {mod?.title}
                            {sub ? ` › ${sub.title}` : ""}
                          </div>
                        </div>
                        <button
                          onClick={() => remove(m.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Löschen"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
