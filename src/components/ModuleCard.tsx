import { Link } from "react-router-dom";
import { Clock, Layers, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { Module } from "@/data/mock";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";

export function ModuleCard({ module }: { module: Module }) {
  const Icon = (Icons as any)[module.icon] ?? Icons.BookOpen;
  return (
    <div className="card-base card-hover group flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue-soft text-accent-blue">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-muted-foreground">Modul {module.number}</div>
        </div>
        <StatusBadge status={module.status} />
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">{module.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{module.description}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" />{module.subtopicCount} Themen</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{Math.round(module.estimatedMinutes / 60 * 10) / 10} h</span>
      </div>

      <div className="mt-4">
        <ProgressBar value={module.progress} showLabel />
      </div>

      <Button asChild variant="ghost" className="mt-5 justify-between group-hover:bg-accent-blue-soft group-hover:text-accent-blue">
        <Link to={`/module/${module.id}`}>
          Modul öffnen
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  );
}
