"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PlatformLandingPage() {
  return (
    <div className="relative min-h-screen bg-surface bg-texture flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <h1 className="font-heading font-bold text-primary tracking-[0.2em] text-5xl mb-4 z-10">
        AROMA AR
      </h1>
      <div className="w-16 h-1 bg-primary rounded-full mb-6 z-10" />
      <p className="text-on-surface-variant text-xl tracking-wide max-w-md z-10 mb-12">
        The premier WebAR menu platform for modern restaurants.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md z-10">
        <Link
          href="/admin"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-full",
            "bg-primary-container text-on-primary-container font-bold text-lg",
            "active:scale-95 transition-transform shadow-[0_4px_20px_rgba(255,191,0,0.3)]"
          )}
        >
          <span className="material-symbols-outlined">dashboard</span>
          Admin Dashboard
        </Link>
        <Link
          href="/r/test-restaurant"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-full",
            "bg-surface-container-high text-on-surface font-bold text-lg border border-surface-container-highest",
            "hover:bg-surface-container-highest active:scale-95 transition-colors"
          )}
        >
          <span className="material-symbols-outlined">view_in_ar</span>
          Demo Menu
        </Link>
      </div>

      <p className="mt-16 text-on-surface-variant/50 text-sm z-10 max-w-sm">
        To view a specific restaurant's AR menu, please scan their QR code.
      </p>
    </div>
  );
}
