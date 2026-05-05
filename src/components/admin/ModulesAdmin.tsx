import { useState } from "react";
import { useModules, type DBModule } from "@/hooks/useCurriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ModulesAdmin() {
  const { data, loading, upsert, remove } = useModules();
  const [editing, setEditing] = useState<DBModule | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    setEditing({
      id: "", number: (data[data.length - 1]?.number ?? 0) + 1, title: "",
      description: "", icon: "BookOpen", estimated_minutes: 120,
      position: (data[data.length - 1]?.position ?? 0) + 1,
    });
    setOpen(true);
  };
  const startEdit = (m: DBModule) => { setEditing(m); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    const id = editing.id || slugify(editing.title);
    if (!id || !editing.title.trim()) {
      toast({ title: "Titel erforderlich", variant: "destructive" });
      return;
    }
    const ok = await upsert({ ...editing, id });
    if (ok) { setOpen(false); toast({ title: "Gespeichert ✓" }); }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Module ({data.length})</h2>
        <Button onClick={startNew} className="bg-primary hover:bg-primary-hover">
          <Plus className="mr-1.5 h-4 w-4" /> Neues Modul
        </Button>
      </div>

      <div className="card-base divide-y divide-border">
        {loading && <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}
        {!loading && data.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Noch keine Module.</div>}
        {data.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold">{m.number}</span>
              <div className="min-w-0">
                <div className="font-medium truncate">{m.title}</div>
                <div className="text-xs text-muted-foreground truncate">{m.description || "—"}</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEdit(m)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteButton onConfirm={() => remove(m.id)} label={m.title} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Modul bearbeiten" : "Neues Modul"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Nummer</Label>
                  <Input type="number" value={editing.number} onChange={(e) => setEditing({ ...editing, number: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="col-span-2">
                  <Label>Icon (Lucide-Name)</Label>
                  <Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="BookOpen" />
                </div>
              </div>
              <div>
                <Label>Titel</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Lerndauer (Minuten)</Label>
                  <Input type="number" value={editing.estimated_minutes} onChange={(e) => setEditing({ ...editing, estimated_minutes: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input type="number" value={editing.position} onChange={(e) => setEditing({ ...editing, position: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button>
            <Button onClick={save} className="bg-primary hover:bg-primary-hover">Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteButton({ onConfirm, label }: { onConfirm: () => Promise<boolean> | void; label: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>"{label}" wirklich löschen?</AlertDialogTitle>
          <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export { DeleteButton, slugify };
