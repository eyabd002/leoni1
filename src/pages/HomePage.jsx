import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const alertes = [
  { nom: "Fatima Zahra El Idrissi", matricule: "EMP001", dept: "Production",  expiration: "15/04/2026" },
  { nom: "Amina Bennani",           matricule: "EMP023", dept: "Logistique",  expiration: "20/04/2026" },
  { nom: "Khadija Alami",           matricule: "EMP045", dept: "Qualité",     expiration: "28/04/2026" },
];

const missionsChart = [
  { label: "Mission A", pct: 85, color: "#2563eb" },
  { label: "Mission B", pct: 72, color: "#16a34a" },
  { label: "Mission C", pct: 68, color: "#f59e0b" },
  { label: "Mission D", pct: 55, color: "#dc2626" },
];

// Simple pie chart using SVG
function PieChart({ data }) {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 70;
  let cumAngle = -Math.PI / 2;
  const total = data.reduce((s, d) => s + d.pct, 0);

  const slices = data.map(d => {
    const angle = (d.pct / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const mid = cumAngle - angle / 2;
    const lx = cx + (r + 28) * Math.cos(mid);
    const ly = cy + (r + 28) * Math.sin(mid);
    const large = angle > Math.PI ? 1 : 0;
    return { ...d, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, lx, ly, mid };
  });

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
          <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 11, fontWeight: 600, fill: s.color }}>
            {s.label} ({s.pct}%)
          </text>
        </g>
      ))}
    </svg>
  );
}

function StatCard({ label, value, color, bg, border, icon }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "18px 20px", flex: "1 1 140px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color, letterSpacing: "-0.04em" }}>{value}</div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Dashboard</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Missions" value="5" color="#2563eb" bg="#eff6ff" border="#bfdbfe"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg>} />
        <StatCard label="Foyers" value="8" color="#7c3aed" bg="#f5f3ff" border="#ddd6fe"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>} />
        <StatCard label="Contrats" value="5" color="#16a34a" bg="#dcfce7" border="#bbf7d0"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
        <StatCard label="Alertes" value={alertes.length} color="#ea580c" bg="#fff7ed" border="#fed7aa"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
      </div>

      {/* Charts + Alerts row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Pie chart */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px", flex: "1 1 340px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Missions les plus efficaces</h3>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 10px" }}>
            <PieChart data={missionsChart} />
          </div>
        </div>

        {/* Contract alerts */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px", flex: "1 1 340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Alertes - Contrats proches d'expiration</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alertes.map((a, i) => (
              <div key={i} style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "12px 14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{a.nom}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{a.matricule} · {a.dept}</div>
                    <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginTop: 3 }}>Expiration: {a.expiration}</div>
                  </div>
                  <button onClick={() => navigate("/contracts")} style={{
                    background: "none", border: "none",
                    color: "#2563eb", fontSize: 12, fontWeight: 600,
                  }}>Voir</button>
                </div>
                <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 6 }}>
                  ⚠️ Ce contrat arrive à expiration, veuillez préparer le renouvellement.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}