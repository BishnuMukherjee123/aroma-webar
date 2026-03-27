"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StitchBottomNavProps {
  onMenuClick?: () => void;
  cartCount?: number;
}

const StitchBottomNav: React.FC<StitchBottomNavProps> = ({ onMenuClick, cartCount = 0 }) => {
  const pathname = usePathname();
  const restaurantId = pathname?.split('/')[2];

  const isActive = (path: string) => {
    if (path === '/ar' && pathname?.includes('/ar')) return true;
    if (path === '/menu' && pathname?.includes('/menu')) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-20 flex justify-around items-center px-8 pb-4 bg-surface/60 backdrop-blur-[20px] rounded-t-[1.5rem] z-50 shadow-[0_-12px_48px_rgba(0,0,0,0.5)] border-t border-outline-variant/10">
      
      {/* AR View */}
      <Link
        href={`/r/${restaurantId}/ar`}
        className={`flex flex-col items-center justify-center rounded-full p-3 transition-all duration-200 active:scale-90 ${
          isActive('/ar')
            ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
            : 'text-primary/60 hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>view_in_ar</span>
      </Link>

      {/* Menu */}
      <button
        onClick={() => onMenuClick ? onMenuClick() : (window.location.href = `/r/${restaurantId}/menu`)}
        className={`flex flex-col items-center justify-center p-3 transition-all duration-200 active:scale-90 ${
          isActive('/menu') ? 'text-primary' : 'text-primary/60 hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
      </button>

      {/* Cart / Bag with count badge */}
      <button className="text-primary/60 hover:text-primary p-3 active:scale-90 transition-all relative">
        <span className="material-symbols-outlined text-2xl" style={cartCount > 0 ? { fontVariationSettings: "'FILL' 1" } : {}}>
          shopping_bag
        </span>
        {cartCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-primary-container text-on-primary-container text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>

      {/* Profile */}
      <button className="text-primary/60 hover:text-primary p-3 active:scale-90 transition-all">
        <span className="material-symbols-outlined text-2xl">person</span>
      </button>
    </nav>
  );
};

export default StitchBottomNav;
