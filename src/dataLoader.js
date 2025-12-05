// src/dataLoader.js

// Path relative to public/ folder
const CSV_URL = "/data/agg_df_final_no_euexpand.csv";

// Simple CSV parser (assumes no commas inside values)
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] === undefined ? "" : cols[i].trim();
    });
    return row;
  });
}

// Helper to cast numeric columns
function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function loadAggData() {
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const rows = parseCSV(text);

  // Normalize/convert fields (adjust names if your CSV differs)
  return rows.map(r => ({
    country_code: r.country_code,
    country: r.country || r.country_code,
    stations: toNumber(r.stations),
    median_power_kw: toNumber(r.median_power_kw),
    fast_dc_share: toNumber(r.fast_dc_share),
    unique_models: toNumber(r.unique_models),
    coverage_norm: toNumber(r.coverage_norm),
    capacity_norm: toNumber(r.capacity_norm),
    fastshare_norm: toNumber(r.fastshare_norm),
    availability_norm: toNumber(r.availability_norm),
    EIRI: toNumber(r.EIRI),
    gap_value: toNumber(r.gap_value),
    cluster: r.cluster !== undefined ? Number(r.cluster) : null,
  }));
}
