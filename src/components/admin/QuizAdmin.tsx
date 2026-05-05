import { useState } from "react";
import { useModules, useQuizQuestionsAdmin, type DBQuizQuestion } from "@/hooks/useCurriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DeleteButton } from "./ModulesAdmin";

type Form = Omit<DBQuizQuestion, "id"> & { id?: string };

export function QuizAdmin() {
  const { data: modules } = useModules();
  const [moduleId, setModuleId] = useState("all");
  const { data, loading, create, update, remove } = useQuizQuestionsAdmin(moduleId);
  const [editing, setEditing] = useState<Form | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    setEditing({
      module_id: modules[0]?.id ?? "", subtopic_id: null,
      question: "", options: ["", "", "", ""], correct_index: 0,
      explanation: "", arabic_explanation: null,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    const opts = editing.options.map((o) => o.trim()).filter(Boolean);
    if (!editing.question.trim() || opts.length < 2 || !editing.module_id) {
      toast({ title: "Frage, Modul und mindestens 2 Antworten erforderlich", variant: "destructive" }); return;
    }
    const correct = Math.min(editing.correct_index, opts.length - 1);
    const payload = { ...editing, options: opts, correct_index: correct, arabic_explanation: editing.arabic_explanation || null };
    const ok = editing.id ? await update(editing.id, payload) : await create(payload as Omit<DBQuizQuestion, "id">);
    if (ok) { setOpen(false); toast({ title: "Gespeichert ✓" }); }
  };

  const setOption = (i: number, v: string) => {
    if (!editing) return;
    const opts = [...editing.options]; opts[i] = v;
    setEditing({ ...editing, options: opts });
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Quizfragen ({data.length})</h2>
        <div className="flex gap-2">
          <Select value={moduleId} onValueChange={setModuleId}>
            <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Alle Module</SelectItem>{modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={startNew} className="bg-primary hover:bg-primary-hover"><Plus className="mr-1.5 h-4 w-4" /> Neu</Button>
        </div>
      </div>

      <div className="card-base divide-y divide-border">
        {loading && <div className="p-8 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>}
        {!loading && data.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Keine Fragen.</div>}
        {data.map((q) => (
          <div key={q.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-muted-foreground">{modules.find((m) => m.id === q.module_id)?.title}</div>
              <div className="mt-1 font-medium line-clamp-2">{q.question}</div>
              <div className="mt-1 text-xs text-success">✓ {q.options[q.correct_index]}</div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(q); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <DeleteButton onConfirm={() => remove(q.id)} label={q.question.slice(0, 50)} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Frage bearbeiten" : "Neue Frage"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Modul</Label>
                <Select value={editing.module_id} onValueChange={(v) => setEditing({ ...editing, module_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Frage</Label><Textarea rows={2} value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Antworten (richtige auswählen)</Label>
                {editing.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditing({ ...editing, correct_index: i })}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 ${editing.correct_index === i ? "border-success bg-success-soft text-success" : "border-border text-muted-foreground"}`}>
                      {editing.correct_index === i ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                    </button>
                    <Input value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Antwort ${String.fromCharCode(65 + i)}`} />
                  </div>
                ))}
              </div>
              <div><Label>Erklärung</Label><Textarea rows={3} value={editing.explanation} onChange={(e) => setEditing({ ...editing, explanation: e.target.value })} /></div>
              <div>
                <Label>Arabische Erklärung (optional)</Label>
                <Textarea rows={2} dir="rtl" className="font-arabic text-right" value={editing.arabic_explanation ?? ""} onChange={(e) => setEditing({ ...editing, arabic_explanation: e.target.value || null })} />
              </div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button><Button onClick={save} className="bg-primary hover:bg-primary-hover">Speichern</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
