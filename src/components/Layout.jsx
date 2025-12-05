// src/components/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-sky-50">
      <header className="bg-slate-900 text-white py-3 shadow">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
          <div className="font-semibold">
            EV Ecosystem Readiness – Capstone
          </div>
          <div className="text-xs text-slate-300">
            2025 Snapshot | Global Charging & Models
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
