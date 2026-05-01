import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "success" | "gradient";
}

export function ProgressBar({ value, className, size = "md", showLabel = false, variant = "gradient" }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-muted", heights[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variant === "gradient" && "bg-gradient-progress",
            variant === "success" && "bg-success",
            variant === "default" && "bg-accent-blue",
          )}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Fortschritt</span>
          <span className="font-medium text-foreground">{v}%</span>
        </div>
      )}
    </div>
  );
}
