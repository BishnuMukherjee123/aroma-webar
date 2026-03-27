"use client";

import React from 'react';

export default function AdminSettingsPage() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl px-10 h-24 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-editorial">Settings</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-label mt-1 font-bold">System Configuration</p>
        </div>
      </header>
      <div className="p-10 space-y-6">
        <div className="bg-surface-container-low p-8 rounded-4xl border border-outline-variant/10 max-w-2xl">
           <h3 className="font-heading font-bold text-on-surface mb-6 uppercase tracking-widest text-xs">Auth Configuration</h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                <div>
                   <p className="text-sm font-bold text-on-surface">Cloud Synchronization</p>
                   <p className="text-[10px] text-on-surface-variant uppercase tracking-label font-bold">Supabase Real-time</p>
                </div>
                <div className="w-12 h-6 bg-primary-container rounded-full flex items-center px-1">
                   <div className="w-4 h-4 bg-on-primary-container rounded-full ml-auto"></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </>
  );
}
