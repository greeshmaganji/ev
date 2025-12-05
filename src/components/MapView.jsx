// src/components/MapView.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function getColor(eiri) {
  if (eiri == null) return "#9ca3af"; // gray
  if (eiri >= 70) return "#16a34a";   // green
  if (eiri >= 40) return "#f97316";   // orange
  return "#ef4444";                   // red
}

export default function MapView({ data, onSelectCountry }) {
  const [centroids, setCentroids] = useState({});

  // Load centroids once from JSON
  useEffect(() => {
    fetch("/data/country_centroids.json")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          console.warn(
            "centroids JSON is an array, expected object keyed by country_code"
          );
          setCentroids({});
        } else {
          setCentroids(json || {});
        }
      })
      .catch((err) => console.error("Error loading centroids:", err));
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg overflow-hidden"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((row) => {
        const raw = centroids[row.country_code];

        if (!raw) {
          // console.warn("No centroid for", row.country_code);
          return null;
        }

        let lat, lon;

        // Case 1: [lat, lon]
        if (Array.isArray(raw) && raw.length >= 2) {
          [lat, lon] = raw;
        }
        // Case 2: {lat, lon} or {latitude, longitude}
        else if (typeof raw === "object" && raw !== null) {
          lat = raw.lat ?? raw.latitude;
          lon = raw.lon ?? raw.lng ?? raw.longitude;
        }

        if (lat == null || lon == null) {
          console.warn("Invalid centroid format for", row.country_code, raw);
          return null;
        }

        const color = getColor(row.EIRI);

        return (
          <CircleMarker
            key={row.country_code}
            center={[lat, lon]}
            radius={5}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
            eventHandlers={{
              click: () => onSelectCountry(row.country_code),
            }}
          >
            <Tooltip>
              <div className="text-xs">
                <div className="font-semibold">
                  {row.country || row.country_code}
                </div>
                <div>EIRI: {row.EIRI?.toFixed(1) ?? "N/A"}</div>
                <div>Gap: {row.gap_value?.toFixed(1) ?? "N/A"}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
