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
  CartesianGrid,
} from "recharts";

const topN = (data, key, n = 10, desc = true) => {
  const sorted = [...data].sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    return desc ? bv - av : av - bv;
  });
  return sorted.slice(0, n);
};

export default function Charts({ data, onSelectCountry }) {
  const top15Eiri = topN(data, "EIRI", 15);
  // Fixed variable name (plural to match usage below, or match singular)
  const top10Gaps = topN(data, "gap_value", 10); 

  // Helper to handle clicks safely
  const handleBarClick = (data) => {
    if (data && data.country_code) {
      onSelectCountry(data.country_code);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      
      {/* 1. Top 15 by EIRI */}
      <div>
        <h3 className="font-semibold mb-2 text-sm">
          Top 15 Countries by EV Readiness (EIRI)
        </h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top15Eiri}
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="country_code"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toFixed(1)}
                labelFormatter={(code) => `Country: ${code}`}
              />
              <Bar
                dataKey="EIRI"
                onClick={handleBarClick} // Now this function exists
                cursor="pointer"
                fill="#8884d8" // Added color so bars are visible
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top 10 by positive gap */}
      <div>
        <h3 className="font-semibold mb-2 text-sm">
          Top 10 Demand-Ahead Gaps (Models &gt; Infrastructure)
        </h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top10Gaps} // Fixed: matches variable name above
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="country_code"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toFixed(1)}
                labelFormatter={(code) => `Country: ${code}`}
              />
              <Bar
                dataKey="gap_value"
                onClick={handleBarClick}
                cursor="pointer"
                fill="#82ca9d" // Added color
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Scatter: EIRI vs Availability */}
      {/* Added the missing opening <div> here */}
      <div className="md:col-span-2"> 
        <h3 className="font-semibold mb-2 text-sm">
          EIRI vs EV Model Availability (All Countries)
        </h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="EIRI"
                name="EIRI"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="availability_norm"
                name="Availability"
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white p-2 rounded shadow text-xs border">
                      <div className="font-semibold">
                        {p.country || p.country_code}
                      </div>
                      <div>EIRI: {p.EIRI?.toFixed(1)}</div>
                      <div>Availability: {p.availability_norm?.toFixed(1)}</div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={data}
                fill="#ff7300"
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