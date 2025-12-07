// src/components/CountryDetail.jsx
import React from "react";

export default function CountryDetail({ country }) {
  // Placeholder when nothing is selected
  if (!country) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-8 text-center border border-slate-200 border-dashed">
        <p className="text-slate-400 text-sm">No country selected</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 20) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 10) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const scoreClass = getScoreColor(country.EIRI);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/80 p-6 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {country.country || country.country_code}
          </h2>
          {country.EIRI != null && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${scoreClass}`}
            >
              EIRI {country.EIRI.toFixed(1)}
            </span>
          )}
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-slate-400 font-semibold">
          {country.Quadrant || "Quadrant Unknown"}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <DetailItem
            label="Charging Stations"
            value={country.stations?.toLocaleString() ?? "—"}
          />
          <DetailItem
            label="EV Models (Index)"
            value={
              country.availability_norm != null
                ? country.availability_norm.toFixed(0)
                : "—"
            }
          />
          <DetailItem
            label="Gap Score"
            value={
              country.gap_value != null ? country.gap_value.toFixed(1) : "—"
            }
            highlight
          />
          <DetailItem
            label="Cluster Group"
            value={country.cluster || "—"}
          />
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
            Infrastructure Notes
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Readiness combines coverage, charging capacity and the mix of fast /
            ultra-fast chargers. Gap score compares infrastructure to expected
            EV model availability. Higher gap values indicate markets where
            demand may outpace charging supply.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, highlight = false }) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        highlight ? "bg-slate-50 border-slate-200" : "border-transparent"
      }`}
    >
      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.16em]">
        {label}
      </div>
      <div
        className={`text-lg font-semibold ${
          highlight ? "text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
