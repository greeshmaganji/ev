// src/components/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-transparent">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      <footer className="w-full text-center py-6 text-slate-500 text-sm font-medium">
        <p>© 2025 Global EV Readiness Project • Capstone Dashboard</p>
      </footer>
    </div>
  );
}
