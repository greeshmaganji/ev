// src/components/CountryDetail.jsx
import React from "react";

function formatNumber(x) {
  if (x == null || isNaN(x)) return "N/A";
  return x.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export default function CountryDetail({ country }) {
  // Nothing selected yet
  if (!country) {
    return (
      <div className="rounded-xl bg-white shadow p-4 text-sm text-gray-700">
        <h2 className="text-lg font-semibold mb-2">Country Details</h2>
        <p className="mb-2">
          Select a country on the map or in a chart to see its EV readiness
          profile:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <b>EIRI</b>: composite EV infrastructure readiness index
            (coverage, capacity, fast charging, models).
          </li>
          <li>
            <b>Gap</b>: availability − readiness. Positive = demand ahead of
            infrastructure, negative = infrastructure ahead of models.
          </li>
          <li>
            <b>Fast charger share</b>: share of DC fast / ultra-fast ports.
          </li>
        </ul>
      </div>
    );
  }

  // We have a selected country row from App.jsx
  const name = country.country || country.country_code;

  return (
    <div className="rounded-xl bg-white shadow-lg p-4 text-sm text-gray-800 border border-slate-100">
      <h2 className="text-lg font-semibold mb-1">
        {name}
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        Country code: {country.country_code}
      </p>
  
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="font-medium">EIRI score</span>
          <span>{formatNumber(country.EIRI)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">
            Gap (availability − readiness)
          </span>
          <span>{formatNumber(country.gap_value)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Charging stations</span>
          <span>{country.stations ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">EV models available</span>
          <span>{country.unique_models ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Fast charger share (norm)</span>
          <span>{formatNumber(country.fastshare_norm)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Capacity index (norm)</span>
          <span>{formatNumber(country.capacity_norm)}</span>
        </div>
      </div>
  
      {/* STORY TEXT */}
      <div className="mt-2 text-xs text-gray-700">
        <p className="font-semibold mb-1">Interpretation</p>
        <p>
          {country.gap_value > 0
            ? "Demand (EV models) is ahead of infrastructure in this country – potential pressure on charging deployment."
            : country.gap_value < 0
            ? "Infrastructure is ahead of model availability – room for OEMs to expand EV offerings."
            : "Demand and infrastructure are roughly balanced based on this index."}
        </p>
        {country.cluster != null && (
          <p className="mt-1">
            Cluster: <b>{country.cluster}</b> (data-driven group based on readiness and availability).
          </p>
        )}
      </div>
    </div>
  );
  
}
