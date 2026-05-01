import { cn } from "@/lib/utils";
import type { Status } from "@/types/learning";

const labels: Record<Status, string> = {
  not_started: "Nicht begonnen",
  in_progress: "In Bearbeitung",
  completed: "Abgeschlossen",
  review: "Wiederholen",
};

const styles: Record<Status, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-info-soft text-accent-blue",
  completed: "bg-success-soft text-success",
  review: "bg-warning-soft text-warning",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        status === "completed" && "bg-success",
        status === "in_progress" && "bg-accent-blue",
        status === "review" && "bg-warning",
        status === "not_started" && "bg-muted-foreground/50",
      )} />
      {labels[status]}
    </span>
  );
}
