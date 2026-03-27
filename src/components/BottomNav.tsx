"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav({ restaurantId }: { restaurantId: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "AR", icon: "view_in_ar", path: `/r/${restaurantId}/ar` },
    { name: "Menu", icon: "restaurant", path: `/r/${restaurantId}/menu` },
    { name: "Bag", icon: "shopping_bag", path: `/r/${restaurantId}/bag` },
    { name: "Profile", icon: "person", path: `/r/${restaurantId}/profile` },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="mx-4 mb-4 backdrop-blur-xl bg-surface-container/80 rounded-[2rem] px-6 py-3 flex items-center justify-between border border-surface-container-high shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center justify-center relative w-16 h-12"
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-full w-12 h-12 self-center mx-auto" />
              )}
              <span
                className={cn(
                  "material-symbols-outlined z-10 transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant"
                )}
              >
                {item.icon}
              </span>
              {isActive && (
                <span className="text-[10px] font-medium text-primary mt-1 z-10">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
