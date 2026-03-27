"use client";

import React from 'react';

export default function AdminDashboardPage() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl px-10 h-24 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-editorial">Analytics Dashboard</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-label mt-1 font-bold">Performance & Insights</p>
        </div>
      </header>
      <div className="p-10">
        <div className="bg-surface-container-low p-20 rounded-4xl border border-outline-variant/10 text-center flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-6xl text-primary/20">monitoring</span>
          <div>
            <h2 className="text-xl font-heading font-bold text-on-surface mb-2">Coming Soon</h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">Advanced restaurant analytics, heatmaps, and conversion tracking are currently being synchronized.</p>
          </div>
        </div>
      </div>
    </>
  );
}
