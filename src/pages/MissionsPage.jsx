import { useState } from "react";

const missionsData = [
  { id: "M001", date: "15/03/2026", ville: "Tunis",    responsable: "Ahmed Benjelloun", transport: "Bus",     objectif: "45/50", statut: "Terminée"  },
  { id: "M002", date: "10/03/2026", ville: "Sfax",     responsable: "Sara El Amrani",   transport: "Minibus", objectif: "28/30", statut: "Terminée"  },
  { id: "M003", date: "12/03/2026", ville: "Sousse",   responsable: "Mohamed Alaoui",   transport: "Van",     objectif: "35/40", statut: "Terminée"  },
  { id: "M004", date: "18/03/2026", ville: "Bizerte",  responsable: "Fatima Rachidi",   transport: "Bus",     objectif: "35",    statut: "En cours"  },
  { id: "M005", date: "20/03/2026", ville: "Kairouan", responsable: "Youssef Bennis",   transport: "Minibus", objectif: "25",    statut: "Planifiée" },
];

const villes = ["Toutes les villes", "Tunis", "Sfax", "Sousse", "Bizerte", "Kairouan"];

const statutConfig = {
  "Terminée":  { bg: "#dcfce7", color: "#16a34a" },
  "En cours":  { bg: "#dbeafe", color: "#2563eb" },
  "Planifiée": { bg: "#f3f4f6", color: "#6b7280" },
};

export default function MissionsPage() {
  const [ville, setVille]   = useState("Toutes les villes");
  const [date, setDate]     = useState("");

  const filtered = missionsData.filter(m =>
    (ville === "Toutes les villes" || m.ville === ville) &&
    (date === "" || m.date.includes(date))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Gestion des Missions</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Gérez les missions de recrutement</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#2563eb", color: "#fff",
          border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle Mission
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Filtres</span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Ville</label>
            <select value={ville} onChange={e => setVille(e.target.value)} style={{
              width: "100%", padding: "7px 10px", border: "1px solid var(--border)",
              borderRadius: 7, fontSize: 13, color: "var(--text-primary)", background: "#fff", outline: "none",
            }}>
              {villes.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 5 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
              width: "100%", padding: "7px 10px", border: "1px solid var(--border)",
              borderRadius: 7, fontSize: 13, color: "var(--text-primary)", background: "#fff", outline: "none",
            }} />
          </div>
          <button onClick={() => { setVille("Toutes les villes"); setDate(""); }} style={{
            padding: "7px 16px", borderRadius: 7, border: "1px solid var(--border)",
            background: "#f9fafb", color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, height: 34,
          }}>Réinitialiser</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>
              {["ID MISSION","DATE","VILLE","RESPONSABLE","TRANSPORT","OBJECTIF","STATUT","ACTIONS"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const sc = statutConfig[m.statut] || { bg: "#f3f4f6", color: "#6b7280" };
              return (
                <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "13px 16px", fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>{m.id}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>{m.date}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>{m.ville}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>{m.responsable}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>{m.transport}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>{m.objectif}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                      {m.statut}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button style={{ background: "none", border: "none", color: "#6b7280", padding: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button style={{ background: "none", border: "none", color: "#6b7280", padding: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      {m.statut === "Terminée" && (
                        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>✓ Résultat</span>
                      )}
                      {m.statut === "En cours" && (
                        <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>+ Résultat</span>
                      )}
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