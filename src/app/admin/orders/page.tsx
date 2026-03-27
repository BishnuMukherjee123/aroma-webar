"use client";

import React from 'react';

export default function AdminOrdersPage() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl px-10 h-24 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface tracking-editorial">Order History</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-label mt-1 font-bold">Transaction Logs</p>
        </div>
      </header>
      <div className="p-10 text-center py-40">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6">receipt_long</span>
        <h2 className="text-on-surface-variant/40 font-heading font-bold text-xl uppercase tracking-widest">No Active Orders</h2>
      </div>
    </>
  );
}
