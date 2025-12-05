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
  const top10Gap = topN(data, "gap_value", 10);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Top 15 by EIRI */}
      <div>
        <h3 className="font-semibold mb-2 text-sm">
          Top 15 Countries by EIRI
        </h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top15Eiri}
              layout="vertical"
              margin={{ left: 40, right: 10, top: 5, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="country_code"
                width={50}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar
                dataKey="EIRI"
                onClick={d =>
                  onSelectCountry(d?.payload?.country_code ?? null)
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 by positive gap */}
      <div>
        <h3 className="font-semibold mb-2 text-sm">
          Top 10 Demand-Ahead Gaps (Availability &gt; Infra)
        </h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top10Gap}
              layout="vertical"
              margin={{ left: 40, right: 10, top: 5, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="country_code"
                width={50}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar
                dataKey="gap_value"
                onClick={d =>
                  onSelectCountry(d?.payload?.country_code ?? null)
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter: EIRI vs Availability */}
      <div className="md:col-span-2">
        <h3 className="font-semibold mb-2 text-sm">
          EIRI vs EV Model Availability
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
                    <div className="bg-white p-2 rounded shadow text-xs">
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
                onClick={d =>
                  onSelectCountry(d?.payload?.country_code ?? null)
                }
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
