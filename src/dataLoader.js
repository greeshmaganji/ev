// src/dataLoader.js

// Path relative to public/ folder
const CSV_URL = "/data/agg_df_final_no_euexpand.csv";

// Simple CSV parser
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

// Helper to cast numeric columns safely
function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function loadAggData() {
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.statusText}`);
    const text = await res.text();
    const rows = parseCSV(text);

    return rows.map(r => {
      // 1. Calculate Gap if missing (Gap = Availability - Readiness)
      const eiri = toNumber(r.EIRI);
      const avail = toNumber(r.availability_norm);
      const gap = r.gap_value ? toNumber(r.gap_value) : (avail - eiri);

      // 2. Determine Quadrant text if missing
      let quadrantStr = r.Quadrant;
      if (!quadrantStr) {
        if (gap > 5) quadrantStr = "Demand-Ahead (High Models)";
        else if (gap < -5) quadrantStr = "Infrastructure-Ahead";
        else quadrantStr = "Balanced Market";
      }

      return {
        country_code: r.country_code,
        country: r.country || r.country_code,
        
        // Map Coordinates (handles common column names)
        lat: toNumber(r.lat) || toNumber(r.latitude), 
        lng: toNumber(r.lon) || toNumber(r.lng) || toNumber(r.longitude),

        // Metrics
        stations: toNumber(r.stations),
        median_power_kw: toNumber(r.median_power_kw),
        fast_charger_share: toNumber(r.fast_dc_share) || toNumber(r.fast_charger_share),
        
        unique_models: toNumber(r.unique_models),
        availability_norm: avail,
        EIRI: eiri,
        gap_value: gap,
        
        Quadrant: quadrantStr,
        cluster: r.cluster, 
      };
    })
    //
    // Removes countries with fewer than 50 stations to prevent skewing results
    .filter(country => country.stations > 50);

  } catch (err) {
    console.error("Error loading CSV data:", err);
    return []; // Return empty array to prevent crash
  }
}