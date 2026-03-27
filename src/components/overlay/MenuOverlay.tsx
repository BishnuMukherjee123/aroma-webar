"use client";

import React, { useMemo } from "react";

import { Dish } from "@/types";
import { cn } from "@/lib/utils";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  loading: boolean;
  selectedDishId: string | null;
  onSelectDish: (dish: Dish) => void;
  onViewInAR?: (dish: Dish) => void;
}

export default function MenuOverlay({
  isOpen,
  onClose,
  dishes,
  loading,
  selectedDishId,
  onSelectDish,
  onViewInAR,
}: MenuOverlayProps) {
  const categorizedDishes = useMemo(() => {
    const map = new Map<string, Dish[]>();
    dishes.forEach((d) => {
      const cat = d.category || "Main Courses";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)?.push(d);
    });
    return Array.from(map.entries());
  }, [dishes]);

  const selectedDish = dishes.find((d) => d.id === selectedDishId);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] transition-all duration-500 ease-out pointer-events-none",
        isOpen ? "bg-black/50 backdrop-blur-sm pointer-events-auto" : "bg-transparent"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 w-full bg-surface-container-low rounded-t-[2rem] flex flex-col shadow-[0_-12px_48px_rgba(0,0,0,0.7)] backdrop-blur-[24px] transition-transform duration-500 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: selectedDish ? "78%" : "72%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle & Header */}
        <div className="pt-4 pb-2 flex flex-col items-center cursor-pointer shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mb-5" />
          <div className="w-full px-8 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-primary-container font-bold uppercase tracking-[0.15em]">Menu</span>
              <h2 className="text-2xl font-heading font-extrabold text-on-surface tracking-tight mt-1">Browse Our Menu</h2>
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95 transition-all">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dish List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 custom-scrollbar min-h-0">
          <div className="space-y-10 pb-4">
            {loading ? (
              <div className="animate-pulse space-y-6 px-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 shimmer rounded-xl" />
                ))}
              </div>
            ) : (
              categorizedDishes.map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <div className="px-2">
                    <p className="text-[11px] font-label font-bold text-on-surface-variant/60 uppercase tracking-[0.15em] pb-2 border-b border-outline-variant/10">
                      {category}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {items.map((dish) => {
                      const isSelected = selectedDishId === dish.id;
                      return (
                        <div
                          key={dish.id}
                          onClick={() => onSelectDish(dish)}
                          className={cn(
                            "stagger-item group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer animate-haptic",
                            isSelected
                              ? "bg-surface-container-high ring-1 ring-primary-container/30 shadow-md"
                              : "hover:bg-surface-container"
                          )}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-18 h-18 shrink-0 rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10" style={{ width: "72px", height: "72px" }}>
                            {dish.thumbnail_url ? (
                              <img src={dish.thumbnail_url} alt={dish.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary/20">
                                <span className="material-symbols-outlined text-3xl">restaurant</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                            <h3 className={cn(
                              "text-sm font-semibold truncate transition-colors",
                              isSelected ? "text-primary-container" : "text-on-surface"
                            )}>
                              {dish.name}
                            </h3>
                            <p className="text-[11px] text-on-surface-variant/70 line-clamp-1">{dish.description}</p>
                            <span className="text-secondary font-bold text-sm mt-0.5">${dish.price.toFixed(2)}</span>
                          </div>

                          {/* View AR Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDish(dish);
                              onViewInAR?.(dish);
                            }}
                            className={cn(
                              "flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all active:scale-90 shrink-0",
                              isSelected
                                ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20"
                                : "border border-outline-variant/30 text-primary hover:bg-surface-container"
                            )}
                          >
                            <span
                              className="material-symbols-outlined text-xl"
                              style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                              view_in_ar
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-tighter">View AR</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            <div className="h-4" />
          </div>
        </div>

        {/* Active Selection / Checkout Bar */}
        {selectedDish && (
          <div className="shrink-0 px-6 py-4 border-t border-outline-variant/10">
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-primary-container/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-on-primary-container/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-75">Current Selection</p>
                  <p className="text-sm font-heading font-extrabold leading-tight">{selectedDish.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-on-primary-container text-primary-container rounded-xl px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
