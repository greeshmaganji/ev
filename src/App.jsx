// src/App.jsx
import React, { useEffect, useState, useMemo } from "react";
import { loadAggData } from "./dataLoader";
import Layout from "./components/Layout";
import MapView from "./components/MapView";
import Charts from "./components/Charts";
import CountryDetail from "./components/CountryDetail";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);

  // Load data
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

  // Selected country
  const selectedCountry = useMemo(
    () => data.find((d) => d.country_code === selectedCode) || null,
    [data, selectedCode]
  );

  // Top-of-page stats
  const stats = useMemo(() => {
    if (!data.length) return null;

    const avgEiri =
      data.reduce((acc, curr) => acc + (curr.EIRI || 0), 0) / data.length;

    const totalStations = data.reduce(
      (acc, curr) => acc + (curr.stations || 0),
      0
    );

    const topCountry = [...data].sort(
      (a, b) => (b.EIRI || 0) - (a.EIRI || 0)
    )[0];

    return {
      count: data.length,
      avgEiri: avgEiri.toFixed(1),
      totalStations: totalStations.toLocaleString(),
      leader: topCountry ? topCountry.country_code : "–",
    };
  }, [data]);

  return (
    <Layout>
      {/* HERO / TITLE */}
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Global EV Readiness & Gap Analysis · 2025
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Global EV Readiness Dashboard
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-500 max-w-2xl">
              Dashboard summarizing EV infrastructure readiness (EIRI),
              EV model availability, and gaps between demand and charging
              infrastructure. Click a country on the map or in the charts to
              view its detailed profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Snapshot · 2025
            </span>
            {stats && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {stats.count} markets analyzed
              </span>
            )}
          </div>
        </div>
      </header>

      {/* STATS ROW – real cards, horizontal */}
      {stats && (
        <section className="mb-10 flex flex-wrap gap-4">
          <StatCard label="Global EV Leader" value={stats.leader} />
          <StatCard label="Charging Stations (Total)" value={stats.totalStations} />
          <StatCard label="Avg Readiness (EIRI)" value={stats.avgEiri} />
          <StatCard label="Markets Analyzed" value={stats.count} />
        </section>
      )}

      {/* MAIN CONTENT: Map + Country details + Charts */}
      <section className="space-y-8">
        {/* Map + Detail side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Map (2/3 width) */}
          <div className="md:col-span-2 bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-1.5 h-[520px] relative overflow-hidden">
            <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Global EV Readiness Map (EIRI)
              </h2>
            </div>
            <MapView data={data} onSelectCountry={setSelectedCode} />
          </div>

          {/* Country detail panel (1/3 width) */}
          <div className="md:col-span-1 h-full min-h-[520px]">
            <CountryDetail country={selectedCountry} />
          </div>
        </div>

        {/* Charts below, full width but inside max-width layout */}
        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Top EV Markets &amp; Largest Gaps
            </h2>
            <p className="text-sm text-slate-500">
              Comparing infrastructure readiness, model availability, and
              demand-ahead markets.
            </p>
          </div>
          <Charts data={data} onSelectCountry={setSelectedCode} />
        </div>
      </section>
    </Layout>
  );
}

// simple stat card, no emojis
function StatCard({ label, value }) {
  return (
    <div className="flex-1 min-w-[180px] bg-white/90 rounded-xl border border-slate-200 shadow-sm px-4 py-3">
      <p className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
