"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import GrainOverlay from "@/components/ui/GrainOverlay";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ─── Tab Content Components ───────────────────────────────────────────────────

function DashboardTab() {
  return (
    <div key="dashboard" className="animate-tab-enter p-10 space-y-8 pb-16">
      <header>
        <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-tight">Dashboard</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">Analytics Overview</p>
      </header>
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Total Dishes", value: "42", trend: "+4 this month", icon: "restaurant_menu" },
          { label: "Live in AR", value: "38", trend: "90% Coverage", icon: "view_in_ar" },
          { label: "AR Latency", value: "Optimal", trend: "Low Latency", icon: "speed" },
          { label: "Avg. Session", value: "2.4m", trend: "Per User", icon: "timer" },
        ].map((s, i) => (
          <div key={i} className="stagger-item bg-surface-container-low p-8 rounded-2xl">
            <span className="material-symbols-outlined text-primary-container mb-3 block">{s.icon}</span>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold">{s.label}</p>
            <p className="text-4xl font-heading font-bold text-primary">{s.value}</p>
            <p className="text-[10px] text-on-surface-variant mt-1">{s.trend}</p>
          </div>
        ))}
      </div>
      {/* AR Cloud Storage */}
      <div className="bg-surface-container-low p-8 rounded-2xl">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">AR Cloud Storage</p>
            <p className="text-3xl font-heading font-bold text-on-surface">2.1 <span className="text-base font-normal text-on-surface-variant">/ 5 GB</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">3D Assets</p>
            <p className="text-3xl font-heading font-bold text-primary-container">38</p>
          </div>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary-container rounded-full transition-all duration-1000" style={{ width: "42%" }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant">
          <span>42% used</span><span>2.9 GB remaining</span>
        </div>
      </div>
    </div>
  );
}

function AssetsTab() {
  return (
    <div key="assets" className="animate-tab-enter p-10 pb-16">
      <header className="mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-tight">AR Assets</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">3D Models & Spatial Data</p>
      </header>
      <div className="bg-surface-container-low p-20 rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center gap-6">
        <span className="material-symbols-outlined text-6xl text-primary/20">3d_rotation</span>
        <div>
          <h2 className="text-xl font-heading font-bold text-on-surface mb-2">Asset Cloud</h2>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto">Manage your shared GLB/USDZ models and spatial anchors across all menu items here.</p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest mt-4 active:scale-95 transition-all">
          Browse Asset Library
        </button>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div key="orders" className="animate-tab-enter p-10 pb-16">
      <header className="mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-tight">Order History</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">Transaction Logs</p>
      </header>
      <div className="text-center py-32">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6 block">receipt_long</span>
        <h2 className="text-on-surface-variant/40 font-heading font-bold text-xl uppercase tracking-widest">No Active Orders</h2>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div key="settings" className="animate-tab-enter p-10 pb-16">
      <header className="mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-tight">Settings</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold">Restaurant Configuration</p>
      </header>
      <div className="space-y-4">
        {[
          { icon: "qr_code_2", label: "QR Code Settings", desc: "Manage your unique Aroma access links" },
          { icon: "notifications", label: "Notifications", desc: "Order alerts and system updates" },
          { icon: "language", label: "Language & Region", desc: "Localization and currency settings" },
          { icon: "security", label: "Security", desc: "Password, 2FA, and session management" },
        ].map((s, i) => (
          <button key={i} className="stagger-item w-full flex items-center gap-5 p-6 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all text-left active:scale-[0.98]">
            <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-container">{s.icon}</span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">{s.label}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{s.desc}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40 ml-auto">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

type Tab = "menu" | "dashboard" | "assets" | "orders" | "settings";

const NAV_ITEMS: { icon: string; label: string; tab: Tab }[] = [
  { icon: "dashboard",     label: "Dashboard",      tab: "dashboard" },
  { icon: "trolley",       label: "Menu Management",tab: "menu"      },
  { icon: "3d_rotation",   label: "AR Assets",      tab: "assets"    },
  { icon: "receipt_long",  label: "Orders",         tab: "orders"    },
  { icon: "settings",      label: "Settings",       tab: "settings"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("menu");
  const [tabKey, setTabKey]       = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || "Login failed.");
    }
  };

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setTabKey(k => k + 1); // Force re-mount of tab content for animation replay
  }, []);

  if (authLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="spinner-arc" />
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 overflow-hidden">
        <GrainOverlay />
        <AmbientGlow />
        <div className="animate-page-enter bg-surface-container-low p-10 rounded-4xl border border-outline-variant/10 w-full max-w-md shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-heading font-extrabold text-primary-container text-4xl mb-2 tracking-logo uppercase">AROMA AR</h1>
            <div className="h-1 w-12 bg-primary-container mx-auto mt-2 rounded-full" />
            <p className="mt-4 text-on-surface-variant font-medium uppercase tracking-widest text-xs">Admin Management Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" required className="w-full px-5 py-4 bg-surface-container-high rounded-xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest ml-1">Password</label>
              <input type="password" required className="w-full px-5 py-4 bg-surface-container-high rounded-xl text-on-surface border border-outline-variant/10 focus:border-primary-container/50 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-4 bg-primary-container text-on-primary-container font-heading font-bold rounded-xl shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest">
              Authorize Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    // The `key` prop forces React to unmount/remount, replaying the enter animation
    if (activeTab === "dashboard") return <DashboardTab key={tabKey} />;
    if (activeTab === "assets")    return <AssetsTab    key={tabKey} />;
    if (activeTab === "orders")    return <OrdersTab    key={tabKey} />;
    if (activeTab === "settings")  return <SettingsTab  key={tabKey} />;
    // "menu" tab renders the original children (admin/page.tsx)
    return <div key={tabKey} className="animate-tab-enter">{children}</div>;
  };

  return (
    <div className="bg-surface text-on-surface font-body h-screen overflow-hidden flex">
      <GrainOverlay />

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col h-full w-72 bg-surface-container-low py-10 z-20 shadow-2xl shrink-0">
        {/* Logo */}
        <div className="px-8 mb-10">
          <span className="text-primary-container font-heading font-extrabold text-2xl tracking-logo uppercase">Aroma AR</span>
        </div>

        {/* Profile chip */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 overflow-hidden shrink-0">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxNYJwl-tj9lQdMcjcKb8YG5fVSCg9qZ0LAKjlYeswhrA9a9Eh6A6gM-g7d9E5klzqVviG7zwyniRh1mdjumFMA6h6Ek2RVdxQLSHdi3wOTubCoglZ8sy3XJwux0agHAc_IE92nfu9Lfe_z8fELf6LawxhkrLY0kzLOtHVC0bpbegODPARhqiyxCKVXvonxkpySzGe9F2gGP6f4sOe3fZXy2Hnq2PyFt8lGiwXob5fzfRWuArd30RhhULJ95uCnYX0g-FxYgrnwiA" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="font-heading font-bold text-sm text-on-surface truncate">Aroma Gourmet</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Premier Digital Menu</p>
            </div>
          </div>
        </div>

        {/* Nav items — pure state, zero routing */}
        <nav className="flex-1 space-y-1 px-4">
          {NAV_ITEMS.map((item, i) => {
            const active = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => switchTab(item.tab)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-150 font-medium text-sm text-left",
                  active
                    ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/10 scale-[1.01]"
                    : "text-primary/70 hover:bg-surface-container-high hover:text-on-surface active:scale-[0.97]"
                )}
              >
                <span
                  className="material-symbols-outlined text-xl transition-all duration-150"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className={cn("transition-all duration-150", active ? "font-bold" : "")}>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary-container/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 mt-4">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-secondary hover:bg-secondary/10 active:scale-[0.97] transition-all font-bold text-sm"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {renderTab()}
      </main>
    </div>
  );
}
