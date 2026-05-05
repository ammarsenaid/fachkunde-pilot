import { useState } from "react";
import { useModules, useFlashcardsAdmin, type DBFlashcard } from "@/hooks/useCurriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DeleteButton } from "./ModulesAdmin";

type Form = Omit<DBFlashcard, "id"> & { id?: string };

export function FlashcardsAdmin() {
  const { data: modules } = useModules();
  const [moduleId, setModuleId] = useState("all");
  const { data, loading, create, update, remove } = useFlashcardsAdmin(moduleId);
  const [editing, setEditing] = useState<Form | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    setEditing({
      module_id: modules[0]?.id ?? "", subtopic_id: null,
      front: "", back: "", arabic_hint: null, difficulty: "medium",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.front.trim() || !editing.back.trim() || !editing.module_id) {
      toast({ title: "Frage, Antwort und Modul erforderlich", variant: "destructive" }); return;
    }
    const payload = { ...editing, arabic_hint: editing.arabic_hint || null };
    const ok = editing.id
      ? await update(editing.id, payload)
      : await create(payload as Omit<DBFlashcard, "id">);
    if (ok) { setOpen(false); toast({ title: "Gespeichert ✓" }); }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Flashcards ({data.length})</h2>
        <div className="flex gap-2">
          <Select value={moduleId} onValueChange={setModuleId}>
            <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Module</SelectItem>
              {modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={startNew} className="bg-primary hover:bg-primary-hover"><Plus className="mr-1.5 h-4 w-4" /> Neu</Button>
        </div>
      </div>

      <div className="card-base divide-y divide-border">
        {loading && <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}
        {!loading && data.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Keine Karten.</div>}
        {data.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-muted-foreground">{modules.find((m) => m.id === f.module_id)?.title} · {f.difficulty}</div>
              <div className="mt-1 font-medium line-clamp-2">{f.front}</div>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{f.back}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(f); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <DeleteButton onConfirm={() => remove(f.id)} label={f.front.slice(0, 50)} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Karte bearbeiten" : "Neue Karte"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Modul</Label>
                  <Select value={editing.module_id} onValueChange={(v) => setEditing({ ...editing, module_id: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Schwierigkeit</Label>
                  <Select value={editing.difficulty} onValueChange={(v) => setEditing({ ...editing, difficulty: v as DBFlashcard["difficulty"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Frage (Vorderseite)</Label><Textarea rows={3} value={editing.front} onChange={(e) => setEditing({ ...editing, front: e.target.value })} /></div>
              <div><Label>Antwort (Rückseite)</Label><Textarea rows={4} value={editing.back} onChange={(e) => setEditing({ ...editing, back: e.target.value })} /></div>
              <div>
                <Label>Arabische Erklärung (optional)</Label>
                <Textarea rows={2} dir="rtl" className="font-arabic text-right" value={editing.arabic_hint ?? ""} onChange={(e) => setEditing({ ...editing, arabic_hint: e.target.value || null })} />
              </div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button><Button onClick={save} className="bg-primary hover:bg-primary-hover">Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
