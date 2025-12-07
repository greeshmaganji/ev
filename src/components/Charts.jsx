// src/components/Charts.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid
} from "recharts";

const topN = (data, key, n = 10, desc = true) => {
  const sorted = [...data].sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    return desc ? bv - av : av - bv;
  });
  return sorted.slice(0, n);
};

// ✨ Custom Glass Tooltip Component
const CustomTooltip = ({ active, payload, label, unit = "", labelText = "Value" }) => {
  if (active && payload && payload.length) {
    const value = Number(payload[0].value);
    const formatted = Number.isFinite(value) ? value.toFixed(1) : "-";

    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-slate-600">
          {labelText}:{" "}
          <span className="font-bold text-emerald-600">
            {formatted}{unit}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ data, onSelectCountry }) {
  const top15Eiri = topN(data, "EIRI", 15);
  const top10Gaps = topN(data, "gap_value", 10);

  const handleBarClick = (data) => {
    if (data && data.country_code) {
      onSelectCountry(data.country_code);
    }
  };
  

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      
      {/* 1. Top 15 by EIRI */}
      <div>
        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Top 15 EV Ready Markets
        </h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top15Eiri}
              margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="colorEiri" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="country_code"
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    labelText="EIRI score"
                  />
                }
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar
                dataKey="EIRI"
                onClick={handleBarClick}
                cursor="pointer"
                fill="url(#colorEiri)"
                radius={[4, 4, 0, 0]} // Rounded tops
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top 10 Gaps */}
      <div>
        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Largest Supply Gaps (Demand {'>'} Infra)
        </h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top10Gaps}
              margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="country_code"
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    labelText="Gap (Demand – Infra)"
                  />
                }
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar
                dataKey="gap_value"
                onClick={handleBarClick}
                cursor="pointer"
                fill="url(#colorGap)"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Scatter Plot */}
      <div className="md:col-span-2"> 
        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Market Correlation: Readiness vs. Availability
        </h3>
        <div style={{ height: 300 }} className="bg-slate-50/50 rounded-xl border border-slate-100 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="EIRI"
                name="EIRI"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                label={{ value: 'Infrastructure Readiness (EIRI)', position: 'bottom', offset: 0, fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="availability_norm"
                name="Availability"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                label={{ value: 'Model Availability', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl text-xs border border-slate-100">
                      <div className="font-bold text-slate-800 text-sm mb-1">
                        {p.country || p.country_code}
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-500">
                        <span>Readiness:</span> <span className="font-mono font-bold text-emerald-600">{p.EIRI?.toFixed(1)}</span>
                        <span>Models:</span> <span className="font-mono font-bold text-blue-600">{p.availability_norm?.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={data}
                fill="#8b5cf6"
                onClick={(d) => {
                   if(d && d.payload) onSelectCountry(d.payload.country_code);
                }}
                cursor="pointer"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
