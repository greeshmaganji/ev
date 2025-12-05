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
    data.find(d => d.country_code === selectedCode) || null;

  return (
    <Layout>
      <div className="mb-4 rounded-xl bg-white/80 p-4 shadow-sm">
        <h1 className="text-3xl font-bold mb-1">
          🌍 Global EV Readiness & Gap Dashboard (2025)
        </h1>
        <p className="text-sm text-gray-700">
          Explore EV readiness (EIRI), model availability & demand–infrastructure gaps.
          Click markers or bars to see country details ➜
        </p>
      </div>

      {data.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">Loading data…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          
          {/* LEFT SIDE — Map + Charts */}
          <div className="lg:col-span-2 space-y-4">

            {/* MAP CARD — FIXED HEIGHT */}
            <div className="rounded-xl bg-white shadow p-4"
                 style={{ height: 400, overflow: "hidden" }}>
              <h2 className="text-lg font-semibold mb-2">
                Global Readiness Map
              </h2>

              {/* THIS MUST HAVE HEIGHT — critical */}
              <div style={{ height: 340, border: "1px solid #e5e7eb" }}>
                <MapView data={data} onSelectCountry={setSelectedCode} />
              </div>
            </div>

            {/* CHARTS */}
            <div className="rounded-xl bg-white shadow p-4">
              <Charts data={data} onSelectCountry={setSelectedCode} />
            </div>
          </div>

          {/* RIGHT SIDE — Details */}
          <div className="lg:col-span-1">
            <CountryDetail country={selectedCountry} />
          </div>
        </div>
      )}
    </Layout>
  );
}
