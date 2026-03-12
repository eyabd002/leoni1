import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMissions } from "../context/MissionsContext.jsx";

const villes = ["Toutes les villes", "Tunis", "Sfax", "Sousse", "Bizerte", "Kairouan"];

const statutConfig = {
  "Terminée":  { bg: "#dcfce7", color: "#16a34a" },
  "En cours":  { bg: "#dbeafe", color: "#2563eb" },
  "Planifiée": { bg: "#f3f4f6", color: "#6b7280" },
};

export default function RecruteurDashboard() {
  const navigate = useNavigate();
  const { missions } = useMissions();
  const [ville, setVille] = useState("Toutes les villes");

  const filtered   = missions.filter(m => ville === "Toutes les villes" || m.ville === ville);
  const terminées  = missions.filter(m => m.statut === "Terminée").length;
  const enCours    = missions.filter(m => m.statut === "En cours").length;
  const planifiées = missions.filter(m => m.statut === "Planifiée").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Tableau de Bord — Recruteur</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Gestion des missions de recrutement</p>
        </div>
        <button onClick={() => navigate("/missions/create")} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.3)", cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle Mission
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Missions", value: missions.length, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
          { label: "Terminées",      value: terminées,       color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
          { label: "En cours",       value: enCours,         color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
          { label: "Planifiées",     value: planifiées,      color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "16px 20px", flex: "1 1 120px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Ville:</span>
        <select value={ville} onChange={e => setVille(e.target.value)} style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 7, fontSize: 13, background: "#fff", outline: "none" }}>
          {villes.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>
              {["ID","DATE","VILLE","RESPONSABLE","TRANSPORT","OBJECTIF","STATUT","ACTIONS"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>Aucune mission trouvée.</td></tr>
            ) : filtered.map((m, i) => {
              const sc = statutConfig[m.statut] || { bg: "#f3f4f6", color: "#6b7280" };
              return (
                <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "13px 16px", fontWeight: 700, fontSize: 13 }}>{m.id}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{m.date}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{m.ville}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{m.responsable}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{m.transport}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{m.objectif}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{m.statut}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button title="Voir" style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button title="Modifier" style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      {m.statut === "Terminée"  && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>✓ Résultat</span>}
                      {m.statut === "En cours"  && <span style={{ fontSize: 11, color: "#2563eb",  fontWeight: 600, cursor: "pointer" }}>+ Résultat</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}