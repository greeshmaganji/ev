// src/components/MapView.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Approximate lat/lng by country_code (center-ish of each country)
const COUNTRY_COORDS = {
  AD: [42.5, 1.6],
  AE: [24.4, 54.4],
  AT: [47.5, 14.5],
  AU: [-25.0, 133.0],
  BE: [50.8, 4.3],
  BG: [42.7, 25.4],
  BR: [-10.0, -55.0],
  CA: [56.0, -96.0],
  CH: [46.8, 8.3],
  CL: [-35.7, -71.5],
  CO: [4.6, -74.1],
  CR: [9.7, -84.2],
  CY: [35.0, 33.0],
  CZ: [49.8, 15.5],
  DE: [51.0, 10.0],
  DK: [56.0, 10.0],
  EE: [58.7, 25.0],
  ES: [40.0, -3.5],
  FI: [64.0, 26.0],
  FR: [46.2, 2.2],
  GB: [54.0, -2.0],
  GR: [39.0, 22.0],
  HK: [22.3, 114.2],
  HR: [45.1, 15.2],
  HU: [47.2, 19.1],
  ID: [-0.8, 113.9],
  IE: [53.3, -8.0],
  IL: [31.0, 35.0],
  IN: [21.0, 78.0],
  IS: [64.9, -19.0],
  IT: [42.8, 12.5],
  JP: [36.0, 138.0],
  KR: [36.0, 128.0],
  KW: [29.3, 47.5],
  LI: [47.2, 9.5],
  LT: [55.3, 23.9],
  LU: [49.8, 6.1],
  LV: [56.9, 24.6],
  MX: [23.6, -102.5],
  MY: [4.2, 102.0],
  NL: [52.1, 5.3],
  NO: [60.5, 8.5],
  NZ: [-41.0, 174.0],
  PL: [52.1, 19.4],
  PT: [39.7, -8.0],
  RO: [45.9, 24.9],
  RS: [44.0, 21.0],
  RU: [61.5, 105.3],
  SE: [60.1, 18.6],
  SI: [46.1, 14.8],
  SK: [48.7, 19.7],
  TR: [39.0, 35.0],
  TW: [23.7, 121.0],
  UA: [49.0, 32.0],
  US: [39.8, -98.6],
  UY: [-32.5, -55.8],
  ZA: [-30.6, 22.9],
};

export default function MapView({ data, onSelectCountry }) {
  const center = [25, 10]; // global-ish view

  const getColor = (score) => {
    if (score >= 70) return "#16a34a"; // green
    if (score >= 40) return "#f97316"; // orange
    return "#ef4444";                 // red
  };

  const getRadius = (score) => {
    if (!Number.isFinite(score)) return 6;
    return 6 + Math.min(6, score / 10);
  };

  return (
    <MapContainer
      center={center}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", background: "transparent" }}
      className="outline-none rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {Array.isArray(data) &&
        data.map((country) => {
          const code = country.country_code;
          const coords = COUNTRY_COORDS[code];

          if (!coords) return null;
          const [lat, lng] = coords;

          const score = Number(country.EIRI) || 0;
          const color = getColor(score);

          return (
            <CircleMarker
              key={code}
              center={[lat, lng]}
              radius={getRadius(score)}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 1,
              }}
              eventHandlers={{
                click: () => onSelectCountry && onSelectCountry(code),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                <div className="text-xs">
                  <div className="font-semibold">
                    {country.country || code}
                  </div>
                  <div className="text-slate-600">
                    EIRI {score.toFixed(1)}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}
