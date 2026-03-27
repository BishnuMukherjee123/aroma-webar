"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import GrainOverlay from "@/components/ui/GrainOverlay";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function PermissionScreen() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.restaurant_id as string;

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate WebAR Engine Initialization
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInitialized(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const requestCamera = async () => {
    setRequesting(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      // Show 'Scanning Environment' status before redirecting
      setScanning(true);
      setTimeout(() => router.push(`/r/${restaurantId}/ar`), 1800);
    } catch (err) {
      console.error(err);
      setError("Camera access was denied. Please allow it in your browser settings.");
      setRequesting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-surface flex items-center justify-center font-body selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Mobile Canvas Simulator */}
      <div className="relative w-full max-w-[390px] h-screen bg-surface overflow-hidden shadow-2xl flex flex-col justify-between animate-page-enter">
        <GrainOverlay />
        <AmbientGlow />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header / Brand Section */}
        <div className="relative pt-32 px-8 flex flex-col items-center text-center z-10">
          <div className="mb-6">
            <h1 className="text-4xl font-heading font-extrabold text-primary-container uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
              Aroma AR
            </h1>
            <div className="h-1 w-12 bg-primary-container mx-auto mt-2 rounded-full"></div>
          </div>
          <p className="font-heading text-lg text-primary font-medium tracking-tight opacity-80">
            Bring flavor to life in AR
          </p>
        </div>

        {/* Center: Visual Hero & Loading */}
        <div className="relative flex flex-col items-center justify-center flex-grow z-10">
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* Abstract Dish Representation */}
            <div className="absolute inset-0 bg-surface-container-high rounded-full rotate-12 opacity-40 animate-pulse"></div>
            <div className="absolute inset-4 bg-surface-container-highest rounded-full -rotate-6 shadow-xl overflow-hidden border border-outline-variant/20 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface-dim flex items-center justify-center text-primary/20">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
              </div>
            </div>
            {/* Animated Spinner (Outer) */}
            <div className="absolute inset-0 border-2 border-transparent border-t-primary-container/40 rounded-full animate-spin"></div>
          </div>

          <div className="w-64 space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>{isInitialized ? "Engine Ready" : "Initializing WebAR..."}</span>
              <span>{Math.floor(loadingProgress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-container transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[9px] text-center text-on-surface-variant/40 font-medium uppercase tracking-v-tight italic">
              Three.js • WebXR • 4K Assets
            </p>
          </div>
        </div>

        {/* Bottom: Action Section */}
        <div className="relative pb-16 px-8 flex flex-col items-center z-10 w-full transition-all duration-700">
          {/* Scanning Environment Overlay (after camera permission) */}
          {scanning ? (
            <div className="w-full flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-3 bg-[#004D4F]/50 backdrop-blur-md border border-[#00FDFF]/40 rounded-full px-6 py-3.5 shadow-[0_0_30px_rgba(0,253,255,0.25)] animate-pulse">
                <span className="material-symbols-outlined text-[#00FDFF]">ar_on_you</span>
                <div>
                  <p className="text-[#00FDFF] text-[11px] font-extrabold uppercase tracking-[0.2em]">Scanning Environment</p>
                  <p className="text-[#00FDFF]/60 text-[9px] uppercase tracking-widest">Analyzing surfaces...</p>
                </div>
              </div>
              <div className="w-48 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-[#00FDFF]/60 rounded-full animate-pulse" style={{ width: "70%" }} />
              </div>
            </div>
          ) : (
            <div className={cn(
              "w-full space-y-4 transition-all duration-700",
              isInitialized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
            )}>
              <button
                onClick={requestCamera}
                className={cn(
                  "w-full py-5 bg-primary-container text-on-primary-container font-heading font-bold text-lg rounded-lg shadow-[0_12px_32px_rgba(207,155,0,0.3)]",
                  "hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3",
                  requesting && "opacity-50 pointer-events-none"
                )}
              >
                <span className="material-symbols-outlined fill" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                {requesting ? "Requesting Access..." : "Allow Camera Access"}
              </button>

              <button
                onClick={() => router.push(`/r/${restaurantId}/menu`)}
                className="w-full py-4 bg-surface-container-high text-on-surface font-heading font-bold text-base rounded-lg border border-outline-variant/10 hover:bg-surface-container-highest active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">restaurant_menu</span>
                Browse Our Menu
              </button>

              <div className="flex flex-col items-center pt-2">
                <p className="text-[10px] text-on-surface-variant font-label font-bold uppercase tracking-widest opacity-60">
                  {error || "Augmented Reality Experience"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Bottom Shadow */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
