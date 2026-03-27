import { cn } from "@/lib/utils";

export function ScanningPill({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-full backdrop-blur-xl bg-surface-container/60 border border-tertiary-container/30 shadow-lg flex items-center gap-2 w-max mx-auto",
        className
      )}
    >
      <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse-glow" />
      <span className="text-tertiary-container text-xs font-semibold tracking-wide">
        {text}
      </span>
    </div>
  );
}
