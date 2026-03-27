"use client";

import { cn } from "@/lib/utils";

export function TopBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4",
        "backdrop-blur-xl bg-surface/60 border-b border-surface-container",
        className
      )}
    >
      <button className="p-2 -ml-2 rounded-full active:scale-[0.98] transition-transform">
        <span className="material-symbols-outlined text-on-surface">menu</span>
      </button>

      <h1 className="font-heading font-bold text-primary tracking-widest text-lg">
        AROMA AR
      </h1>

      <button className="p-2 -mr-2 rounded-full active:scale-[0.98] transition-transform">
        <span className="material-symbols-outlined text-on-surface">restaurant_menu</span>
      </button>
    </div>
  );
}
