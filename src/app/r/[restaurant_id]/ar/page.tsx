"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation"
import StitchTopBar from "@/components/layout/StitchTopBar";
import StitchBottomNav from "@/components/layout/StitchBottomNav";
import GrainOverlay from "@/components/ui/GrainOverlay";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { useDishes } from "@/hooks/useDishes";
import { Dish } from "@/types";
import MenuOverlay from "@/components/overlay/MenuOverlay";
import { cn } from "@/lib/utils";

export default function ARViewerScreen() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantId = params.restaurant_id as string;
  const initialDishId = searchParams.get("dish");

  const { dishes, loading } = useDishes(restaurantId);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [arStatus, setArStatus] = useState<"scanning" | "detected" | "placed">("scanning");
  const [cart, setCart] = useState<Dish[]>([]);

  useEffect(() => {
    if (arStatus === "scanning") {
      const timer = setTimeout(() => setArStatus("detected"), 3000);
      return () => clearTimeout(timer);
    }
  }, [arStatus]);

  useEffect(() => {
    // Suppress expected DEV warnings from Lit and model-viewer to keep console clean
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (
        msg.includes('Lit is in dev mode') || 
        msg.includes('scheduled an update') ||
        msg.includes('rAF timed out') ||
        msg.includes('updateSource')
      )) {
        return; // Mute specific model-viewer warnings
      }
      originalWarn(...args);
    };

    import("@google/model-viewer").catch(console.error);

    return () => {
      console.warn = originalWarn; // Restore on unmount
    };
  }, []);

  useEffect(() => {
    if (!loading && dishes.length > 0) {
      if (initialDishId) {
        const found = dishes.find((d) => d.id === initialDishId);
        if (found) setSelectedDish(found);
      } else if (!selectedDish) {
        setSelectedDish(dishes[0]);
      }
    }
  }, [loading, dishes, initialDishId, selectedDish]);

  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
    setIsMenuOpen(false);
  };

  const handlePlace = () => {
    if (arStatus === "detected") setArStatus("placed");
  };

  const handleAddToCart = (dish: Dish) => {
    setCart((prev) => [...prev, dish]);
  };

  // Info modal allergen tags derived from dish description keywords
  const getAllergens = (dish: Dish) => {
    const desc = (dish.description || "").toLowerCase();
    const tags = [];
    if (desc.includes("gluten") || desc.includes("bread") || desc.includes("pasta") || desc.includes("gnocchi")) tags.push({ label: "Gluten", icon: "grain" });
    if (desc.includes("dairy") || desc.includes("butter") || desc.includes("cream") || desc.includes("truffle butter")) tags.push({ label: "Dairy", icon: "water_drop" });
    if (desc.includes("nut") || desc.includes("almond") || desc.includes("walnut")) tags.push({ label: "Nuts", icon: "eco" });
    if (tags.length === 0) tags.push({ label: "Vegan Friendly", icon: "eco" }, { label: "Gluten-Free", icon: "check_circle" });
    return tags;
  };

  return (
    <div className="relative min-h-screen bg-surface font-body antialiased overflow-hidden flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[390px] h-screen bg-surface overflow-hidden shadow-2xl flex flex-col animate-page-enter">
        <GrainOverlay />
        <AmbientGlow />

        {/* Camera Feed Simulation */}
        <div className="absolute inset-0 z-0" onClick={handlePlace}>
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZX5P__CmrjzFlDQRsJ836tzjKfMHc4Z2LViqiha45X31KaEqzEO6he-AOc-mFy3g0B8eChceUVEAhIHxKEF0GXoEdYPa8PrzjA0dT_9tdmDgGuYI3kCm9u4_h705jNn_2lzCr-Q4X8AaK8VssMKenWif2x1T70auI3k5gpvuWoMfteEK0hZD327endegDmTphnu41EsnRa90zr5XQrXwZhcdc2K6lKf4z7x5UyRy69Oj32KchafdlctvzOq_zJ9ZCo0wNty0PXWk"
            alt="AR Table Surface"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-transparent to-surface/50" />
        </div>

        <StitchTopBar />

        {/* UI Overlay Layer */}
        <main className="relative z-10 flex-1 w-full flex flex-col justify-end p-6 pb-24">

          {/* State-Based AR Prompts */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full px-10 text-center pointer-events-none">
            {arStatus === "scanning" && (
              <div className="inline-flex items-center gap-2 bg-[#004D4F]/40 backdrop-blur-md border border-[#00FDFF]/30 rounded-full px-5 py-2 animate-pulse shadow-[0_0_20px_rgba(0,253,255,0.2)]">
                <span className="material-symbols-outlined text-[#00FDFF] text-sm">ar_on_you</span>
                <span className="text-[#00FDFF] text-[10px] uppercase font-label tracking-[0.15em] font-extrabold">Scanning Surface...</span>
              </div>
            )}
            {arStatus === "detected" && (
              <div
                className="bg-primary-container/90 backdrop-blur-xl border border-primary-container text-on-primary-container px-8 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-in zoom-in-95 duration-500 pointer-events-auto cursor-pointer"
                onClick={handlePlace}
              >
                <span className="material-symbols-outlined text-4xl animate-bounce">touch_app</span>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Surface Found</p>
                  <p className="text-sm font-heading font-extrabold">Tap to Place Dish</p>
                </div>
              </div>
            )}
          </div>

          {/* 3D Model Viewport */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none z-0 transition-all duration-1000",
            arStatus === "placed" ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            {selectedDish ? (
              <div className="relative w-80 h-80 flex items-center justify-center animate-float">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/40 blur-xl rounded-full" />
                <model-viewer
                  src={selectedDish.model_url || ""}
                  alt={selectedDish.name}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  shadow-intensity="1"
                  className="w-full h-full pointer-events-auto"
                  style={{ width: "100%", height: "100%", outline: "none" }}
                  key={selectedDish.id}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="ar-scan-line" />
                  </div>
                </model-viewer>
              </div>
            ) : (
              <div className="spinner-arc" />
            )}
          </div>

          {/* Floating Dish Card (shown only after placement) */}
          {selectedDish && arStatus === "placed" && (
            <div className="relative mb-2 animate-spring-pop">

              {/* AR Manipulation Controls */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { icon: "touch_app", label: "Place", action: handlePlace },
                  { icon: "3d_rotation", label: "Rotate", action: () => {} },
                  { icon: "aspect_ratio", label: "Scale", action: () => {} },
                  { icon: "photo_camera", label: "Capture", action: () => {} },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    className="w-14 h-14 rounded-full bg-surface-container-high/80 backdrop-blur-md flex flex-col items-center justify-center text-primary active:scale-95 transition-all shadow-xl border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined">{btn.icon}</span>
                    <span className="text-[8px] uppercase tracking-tighter mt-0.5">{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Info Card */}
              <div className="bg-surface-variant/30 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-outline-variant/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-4">
                    <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest mb-1 block">
                      {selectedDish.category || "Chef's Signature"}
                    </span>
                    <h2 className="text-xl font-heading font-bold text-on-surface">
                      {selectedDish.name}
                    </h2>
                  </div>
                  <span className="text-xl font-heading font-bold text-primary-container shrink-0">
                    ${selectedDish.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed mb-5 line-clamp-2">
                  {selectedDish.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(selectedDish)}
                    className="flex-1 bg-primary-container text-on-primary-container py-4 rounded-xl font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                    Add to Order
                  </button>

                  {/* Info (i) Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsInfoOpen(true); }}
                    className="w-14 h-14 bg-surface-container-high/80 backdrop-blur-md border border-outline-variant/10 flex items-center justify-center rounded-full active:scale-95 transition-all shadow-lg text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined">info</span>
                  </button>

                  {/* Menu Toggle Button */}
                  <button
                    onClick={() => setIsMenuOpen(true)}
                    className="w-14 h-14 bg-surface-container-high/80 backdrop-blur-md border border-outline-variant/10 flex items-center justify-center rounded-full active:scale-95 transition-all shadow-lg text-primary-container"
                  >
                    <span className="material-symbols-outlined">restaurant_menu</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Info Modal Overlay */}
        {isInfoOpen && selectedDish && (
          <div
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setIsInfoOpen(false)}
          >
            <div
              className="w-full bg-surface-container-low rounded-t-4xl p-8 pb-28 animate-modal-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Dish Details</p>
                  <h3 className="text-2xl font-heading font-bold text-on-surface">{selectedDish.name}</h3>
                </div>
                <button onClick={() => setIsInfoOpen(false)} className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                {selectedDish.description || "A signature dish crafted with the finest seasonal ingredients, prepared to perfection by our executive chef."}
              </p>

              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3">Allergens & Dietary Info</p>
                <div className="flex flex-wrap gap-2">
                  {getAllergens(selectedDish).map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-surface-container px-3 py-2 rounded-full border border-outline-variant/20">
                      <span className="material-symbols-outlined text-sm text-secondary">{tag.icon}</span>
                      <span className="text-xs font-bold text-on-surface">{tag.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Calories", value: "620 kcal" },
                  { label: "Protein", value: "48g" },
                  { label: "Prep Time", value: "25 min" },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-container rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-on-surface-variant mb-1">{stat.label}</p>
                    <p className="text-sm font-heading font-bold text-primary-container">{stat.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { handleAddToCart(selectedDish); setIsInfoOpen(false); }}
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                Add to Order — ${selectedDish.price.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* Menu Overlay */}
        <MenuOverlay
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          dishes={dishes}
          loading={loading}
          selectedDishId={selectedDish?.id || null}
          onSelectDish={handleSelectDish}
          onViewInAR={(dish) => { handleSelectDish(dish); if (arStatus !== "placed") setArStatus("placed"); }}
        />

        <StitchBottomNav
          onMenuClick={() => setIsMenuOpen(true)}
          cartCount={cart.length}
        />
      </div>
    </div>
  );
}
