import { useState } from "react";
import { useModules, useSubtopics, type DBSubtopic } from "@/hooks/useCurriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DeleteButton, slugify } from "./ModulesAdmin";

export function SubtopicsAdmin() {
  const { data: modules } = useModules();
  const [moduleId, setModuleId] = useState<string>("");
  const activeId = moduleId || modules[0]?.id || "";
  const { data, loading, upsert, remove } = useSubtopics(activeId || undefined);
  const [editing, setEditing] = useState<DBSubtopic | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    if (!activeId) { toast({ title: "Bitte zuerst ein Modul auswählen" }); return; }
    setEditing({
      id: "", module_id: activeId, title: "", description: "",
      reading_minutes: 12, exam_relevance: 2,
      position: (data[data.length - 1]?.position ?? 0) + 1,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    const id = editing.id || `${editing.module_id}-${slugify(editing.title)}`;
    if (!editing.title.trim()) { toast({ title: "Titel erforderlich", variant: "destructive" }); return; }
    const ok = await upsert({ ...editing, id });
    if (ok) { setOpen(false); toast({ title: "Gespeichert ✓" }); }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Unterthemen</h2>
        <div className="flex gap-2">
          <Select value={activeId} onValueChange={setModuleId}>
            <SelectTrigger className="w-[260px]"><SelectValue placeholder="Modul wählen" /></SelectTrigger>
            <SelectContent>{modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.number}. {m.title}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={startNew} className="bg-primary hover:bg-primary-hover"><Plus className="mr-1.5 h-4 w-4" /> Neu</Button>
        </div>
      </div>

      <div className="card-base divide-y divide-border">
        {loading && <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}
        {!loading && data.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Keine Unterthemen.</div>}
        {data.map((s, i) => (
          <div key={s.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold">{i + 1}</span>
              <div className="min-w-0">
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-xs text-muted-foreground truncate">{s.description || "—"} · {s.reading_minutes} Min · Relevanz {s.exam_relevance}/3</div>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <DeleteButton onConfirm={() => remove(s.id)} label={s.title} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Unterthema bearbeiten" : "Neues Unterthema"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Modul</Label>
                <Select value={editing.module_id} onValueChange={(v) => setEditing({ ...editing, module_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Titel</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Beschreibung</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Lesezeit (Min)</Label><Input type="number" value={editing.reading_minutes} onChange={(e) => setEditing({ ...editing, reading_minutes: parseInt(e.target.value) || 0 })} /></div>
                <div>
                  <Label>Prüfungs-Relevanz</Label>
                  <Select value={String(editing.exam_relevance)} onValueChange={(v) => setEditing({ ...editing, exam_relevance: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 – Niedrig</SelectItem><SelectItem value="2">2 – Mittel</SelectItem><SelectItem value="3">3 – Hoch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Position</Label><Input type="number" value={editing.position} onChange={(e) => setEditing({ ...editing, position: parseInt(e.target.value) || 0 })} /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button><Button onClick={save} className="bg-primary hover:bg-primary-hover">Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
