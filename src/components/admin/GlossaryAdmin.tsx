import { useState } from "react";
import { useGlossary, type DBGlossaryTerm } from "@/hooks/useCurriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DeleteButton } from "./ModulesAdmin";

type Form = Omit<DBGlossaryTerm, "id"> & { id?: string };

export function GlossaryAdmin() {
  const { data, loading, create, update, remove } = useGlossary();
  const [editing, setEditing] = useState<Form | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => { setEditing({ term: "", category: "Allgemein", definition: "", arabic: null }); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    if (!editing.term.trim() || !editing.definition.trim()) {
      toast({ title: "Begriff und Definition erforderlich", variant: "destructive" }); return;
    }
    const payload = { ...editing, arabic: editing.arabic || null };
    const ok = editing.id ? await update(editing.id, payload) : await create(payload as Omit<DBGlossaryTerm, "id">);
    if (ok) { setOpen(false); toast({ title: "Gespeichert ✓" }); }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Glossar ({data.length})</h2>
        <Button onClick={startNew} className="bg-primary hover:bg-primary-hover"><Plus className="mr-1.5 h-4 w-4" /> Neu</Button>
      </div>

      <div className="card-base divide-y divide-border">
        {loading && <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}
        {!loading && data.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Keine Begriffe.</div>}
        {data.map((g) => (
          <div key={g.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{g.term}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{g.category}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{g.definition}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <DeleteButton onConfirm={() => remove(g.id)} label={g.term} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Begriff bearbeiten" : "Neuer Begriff"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Begriff</Label><Input value={editing.term} onChange={(e) => setEditing({ ...editing, term: e.target.value })} /></div>
                <div><Label>Kategorie</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              </div>
              <div><Label>Definition</Label><Textarea rows={3} value={editing.definition} onChange={(e) => setEditing({ ...editing, definition: e.target.value })} /></div>
              <div>
                <Label>Arabisch (optional)</Label>
                <Textarea rows={2} dir="rtl" className="font-arabic text-right" value={editing.arabic ?? ""} onChange={(e) => setEditing({ ...editing, arabic: e.target.value || null })} />
              </div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button><Button onClick={save} className="bg-primary hover:bg-primary-hover">Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
