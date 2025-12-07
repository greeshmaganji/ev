// src/App.jsx
import React, { useEffect, useState } from "react";
import { loadAggData } from "./dataLoader";
import Layout from "./components/Layout";
import MapView from "./components/MapView";
import Charts from "./components/Charts";
import CountryDetail from "./components/CountryDetail";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await loadAggData();
        setData(d);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    })();
  }, []);

  const selectedCountry =
    data.find((d) => d.country_code === selectedCode) || null;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🌍 Global EV Readiness & Gap Dashboard (2025)
        </h1>
        <p className="text-sm text-gray-700 mt-1">
          Explore EV readiness (EIRI), model availability, and
          demand–infrastructure gaps. Click markers or bars to see
          country-level details ➜
        </p>
      </div>

      {/* Main layout: left = visuals, right = country detail */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT: map + charts */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-2">Global Readiness Map</h2>
            <div style={{ height: 380 }}>
              <MapView data={data} onSelectCountry={setSelectedCode} />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Marker color:{" "}
              <span className="font-semibold text-green-600">Green</span> =
              high readiness (EIRI ≥ 70),{" "}
              <span className="font-semibold text-orange-500">Orange</span> =
              medium (40–69),{" "}
              <span className="font-semibold text-red-500">Red</span> = low
              (&lt; 40).
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <Charts data={data} onSelectCountry={setSelectedCode} />
          </div>
        </div>

        {/* RIGHT: sticky country details */}
        <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-4 self-start">
          <CountryDetail country={selectedCountry} />
        </div>
      </div>
    </Layout>
  );
}
