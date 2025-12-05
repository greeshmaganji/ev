// src/components/CountryDetail.jsx
import React from "react";

function gapLabel(gap) {
  if (gap == null) return "N/A";
  if (gap > 10) return "Demand ahead of infrastructure";
  if (gap < -10) return "Infrastructure ahead of demand";
  return "Roughly balanced";
}

function clusterLabel(cluster) {
  if (cluster === 0) return "Cluster 0 – Emerging";
  if (cluster === 1) return "Cluster 1 – Leaders";
  if (cluster === 2) return "Cluster 2 – Moderate";
  if (cluster === 3) return "Cluster 3 – Lagging";
  return "Unknown cluster";
}

export default function CountryDetail({ country }) {
  if (!country) {
    return (
      <div className="rounded-xl bg-white shadow p-4 h-full">
        <h2 className="text-lg font-semibold mb-2">Country Details</h2>
        <p className="text-sm text-gray-600 mb-2">
          Select a country from the map or a bar in the charts to see its EV
          readiness, EV model availability, and gap analysis.
        </p>
        <ul className="text-xs text-gray-500 list-disc list-inside">
          <li>EIRI: composite index of coverage, capacity, fast charging, and EV models.</li>
          <li>Positive gap: demand (models) is ahead of infrastructure.</li>
          <li>Negative gap: infrastructure is ahead of model availability.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow p-4 h-full">
      <h2 className="text-lg font-semibold mb-1">
        {country.country} ({country.country_code})
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        {clusterLabel(country.cluster)}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <div className="text-xs text-gray-500">EIRI</div>
          <div className="text-xl font-semibold">
            {country.EIRI?.toFixed(1) ?? "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Gap</div>
          <div className="text-xl font-semibold">
            {country.gap_value?.toFixed(1) ?? "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {gapLabel(country.gap_value)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Stations</div>
          <div>{country.stations ?? "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Unique EV Models</div>
          <div>{country.unique_models ?? "N/A"}</div>
        </div>
      </div>

      <h3 className="text-sm font-semibold mb-1">Index Components</h3>
      <ul className="text-xs text-gray-600 space-y-1">
        <li>
          <span className="font-semibold">Coverage:</span>{" "}
          {country.coverage_norm?.toFixed(1) ?? "N/A"}
        </li>
        <li>
          <span className="font-semibold">Capacity:</span>{" "}
          {country.capacity_norm?.toFixed(1) ?? "N/A"}
        </li>
        <li>
          <span className="font-semibold">Fast charging:</span>{" "}
          {country.fastshare_norm?.toFixed(1) ?? "N/A"}
        </li>
        <li>
          <span className="font-semibold">Availability:</span>{" "}
          {country.availability_norm?.toFixed(1) ?? "N/A"}
        </li>
      </ul>
    </div>
  );
}
