"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'trolley', label: 'Menu Management', path: '/admin' },
    { icon: '3d_rotation', label: 'AR Assets', path: '/admin/assets' },
    { icon: 'receipt_long', label: 'Orders', path: '/admin/orders' },
    { icon: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname?.startsWith(path);
  };

  return (
    <aside className="hidden md:flex flex-col h-full w-72 bg-surface-container-low py-10 z-20 shadow-2xl relative animate-page-enter">
      <div className="px-8 mb-12">
        <Link href="/admin" className="text-primary-container font-heading font-extrabold text-2xl tracking-logo uppercase hover:opacity-80 transition-opacity">
          Aroma AR
        </Link>
      </div>

      <div className="px-6 mb-10">
        <div className="flex items-center gap-4 p-4 rounded-md bg-surface-container-high">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 overflow-hidden shrink-0">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxNYJwl-tj9lQdMcjcKb8YG5fVSCg9qZ0LAKjlYeswhrA9a9Eh6A6gM-g7d9E5klzqVviG7zwyniRh1mdjumFMA6h6Ek2RVdxQLSHdi3wOTubCoglZ8sy3XJwux0agHAc_IE92nfu9Lfe_z8fELf6LawxhkrLY0kzLOtHVC0bpbegODPARhqiyxCKVXvonxkpySzGe9F2gGP6f4sOe3fZXy2Hnq2PyFt8lGiwXob5fzfRWuArd30RhhULJ95uCnYX0g-FxYgrnwiA" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <div className="font-heading font-bold text-sm text-on-surface truncate">Aroma Gourmet</div>
            <div className="text-[10px] text-on-surface-variant uppercase tracking-label font-bold">Premier Digital Menu</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item, i) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.label} 
              href={item.path}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "stagger-item w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all font-medium text-sm group",
                active 
                  ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/10 active:scale-95" 
                  : "text-primary/70 hover:bg-surface-container-high hover:text-on-surface active:scale-[0.97]"
              )}
            >
              <span className="material-symbols-outlined text-xl" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className={cn(active ? "font-bold" : "")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-6 rounded-card bg-surface-container-high shadow-inner mb-6">
          <p className="text-[10px] text-primary font-bold uppercase tracking-label mb-3">Storage Status</p>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mb-3 overflow-hidden">
            <div className="bg-primary-container h-1.5 rounded-full w-[65%]" style={{ boxShadow: "0 0 10px var(--color-primary-container)" }}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant">6.5GB of 10GB AR Cloud used</p>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all font-bold text-sm text-secondary hover:bg-secondary/10 active:scale-95 mb-4"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
