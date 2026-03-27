"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import StitchTopBar from "@/components/layout/StitchTopBar";
import StitchBottomNav from "@/components/layout/StitchBottomNav";
import GrainOverlay from "@/components/ui/GrainOverlay";
import AmbientGlow from "@/components/ui/AmbientGlow";
import GlassPanel from "@/components/ui/GlassPanel";
import { useDishes } from "@/hooks/useDishes";

export default function MenuBrowseScreen() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurant_id as string;
  const { dishes, loading } = useDishes(restaurantId);

  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  const categorizedDishes = useMemo(() => {
    const map = new Map<string, typeof dishes>();
    dishes.forEach((d) => {
      const cat = d.category || "Main Courses";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)?.push(d);
    });
    return Array.from(map.entries());
  }, [dishes]);

  return (
    <div className="relative min-h-screen bg-surface flex flex-col items-center justify-center font-body selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Mobile Canvas Simulator */}
      <div className="relative w-full max-w-[390px] h-screen bg-surface overflow-hidden shadow-2xl flex flex-col">
        <GrainOverlay />
        <AmbientGlow />

        {/* AR Background Mockup */}
        <div className="absolute inset-0 z-0 h-[45vh]">
          <div 
            className="w-full h-full bg-cover bg-center opacity-80" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbuQ-5qfKNWwn6JUyrq9bhODJdIKZJ_ZzC9UcxkBUfTk0zzit9fRrXppi6cwpQKgUw9LHH_TvtBcgK2QrjqssljRuhvilVXoQ9nDAEYxGQtAm9Y24cxzselFADSV2bRhdch2To1vTC6kGv_qoB_LJwcIofpRf5mcd-cGYXQJXHH7HHoI3T9JJNir0N_rjwjehdJwsKlEIP4csKx2vW8ZgbiTcfuOqkhZ6qFI0c29BwldsjxLZa92GdMr6I0j5p6dCuOVh2aJr_k7A')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-transparent to-surface"></div>
        </div>

        <StitchTopBar />

        {/* AR Scan Instruction Overlay */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
          <div className="bg-[#004D4F]/40 backdrop-blur-md border border-[#00FDFF]/30 rounded-full px-6 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(0,253,255,0.2)]">
            <span className="material-symbols-outlined text-[#00FDFF] text-xl">ar_on_you</span>
            <span className="text-[#00FDFF] font-heading text-[10px] uppercase tracking-[0.15em] font-extrabold">Scan Table Surface</span>
          </div>
        </div>

        {/* Main Content: Slide-up Bottom Sheet Panel */}
        <div className="absolute bottom-0 left-0 w-full h-[75%] bg-surface-container-low rounded-t-card z-40 flex flex-col shadow-[0_-12px_48px_rgba(0,0,0,0.6)] pb-24 backdrop-blur-[20px]">
          {/* Drag Handle & Header */}
          <div className="pt-4 pb-2 flex flex-col items-center">
            <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mb-6"></div>
            <div className="w-full px-8 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-primary-container font-bold uppercase tracking-label">Menu</span>
                <h2 className="text-2xl font-heading font-extrabold text-on-surface tracking-editorial mt-1">Browse Our Menu</h2>
              </div>
              <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95 transition-all">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          {/* Scrollable Dish List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <div className="space-y-12">
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-surface-container rounded-lg" />
                  ))}
                </div>
              ) : (
                categorizedDishes.map(([category, items]) => (
                  <div key={category} className="space-y-8">
                    {/* Category Label */}
                    <div className="px-2">
                      <p className="text-[11px] font-label font-bold text-on-surface-variant/60 uppercase tracking-label pb-2">
                        {category}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {items.map((dish) => {
                        const isSelected = selectedDishId === dish.id;
                        return (
                          <div
                            key={dish.id}
                            onClick={() => setSelectedDishId(dish.id)}
                            className={`group flex items-center gap-4 p-3 rounded-md transition-all duration-300 active:scale-[0.98] ${
                              isSelected 
                                ? "bg-surface-container-high border-l-4 border-primary-container" 
                                : "hover:bg-surface-container"
                            }`}
                          >
                            <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-surface-container-lowest">
                              {dish.thumbnail_url ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={dish.thumbnail_url}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                  />
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary/20">
                                  <span className="material-symbols-outlined text-4xl">restaurant</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-0.5">
                              <h3 className={`text-base font-body font-semibold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                                {dish.name}
                              </h3>
                              <p className="text-xs text-on-surface-variant/80 line-clamp-1">
                                {dish.description}
                              </p>
                              <span className="text-secondary font-bold text-sm mt-1">${dish.price.toFixed(2)}</span>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/r/${restaurantId}/ar?dish=${dish.id}`);
                              }}
                              className={`px-3 py-3 rounded-md flex flex-col items-center gap-1 active:scale-95 transition-all ${
                                isSelected 
                                  ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20" 
                                  : "border border-outline-variant/30 text-primary"
                              }`}
                            >
                              <span className="material-symbols-outlined text-xl" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                view_in_ar
                              </span>
                              <span className="text-[8px] font-bold uppercase tracking-v-tight">View AR</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
              {/* Extra spacing for bottom nav */}
              <div className="h-20" />
            </div>
          </div>
        </div>

        {/* Floating Order Summary Chip */}
        {selectedDishId && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-full px-6 pointer-events-none">
            <div className="bg-primary-container text-on-primary-container p-4 rounded-lg flex justify-between items-center shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-on-primary-container/10 flex items-center justify-center">
                  <span className="font-bold text-xs">1</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Current Selection</p>
                  <p className="text-sm font-bold font-heading">
                    {dishes.find(d => d.id === selectedDishId)?.name}
                  </p>
                </div>
              </div>
              <button className="bg-on-primary-container text-primary-container rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform">
                Checkout
              </button>
            </div>
          </div>
        )}

        <StitchBottomNav />
      </div>
    </div>
  );
}
