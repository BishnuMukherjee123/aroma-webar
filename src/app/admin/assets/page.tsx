"use client";

import React from 'react';

export default function AdminAssetsPage() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl px-10 h-24 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-editorial">AR Assets</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-label mt-1 font-bold">3D Models & Spatial Data</p>
        </div>
      </header>
      <div className="p-10">
        <div className="bg-surface-container-low p-20 rounded-4xl border border-outline-variant/10 text-center flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-6xl text-primary/20">3d_rotation</span>
          <div>
            <h2 className="text-xl font-heading font-bold text-on-surface mb-2">Asset Cloud</h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">Manage your shared GLB/USDZ models and spatial anchors across all menu items here.</p>
          </div>
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-md font-bold text-sm uppercase tracking-widest mt-4">
            Browse Asset Library
          </button>
        </div>
      </div>
    </>
  );
}
