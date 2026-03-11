import { useState } from "react";

const dormsData = [
  { id: "F001", nom: "Foyer Tunis Nord",    ville: "Tunis",   capacite: 120, occupes: 98,  responsable: "Amel Gharbi",   statut: "Actif"    },
  { id: "F002", nom: "Foyer Sfax Centre",   ville: "Sfax",    capacite: 80,  occupes: 80,  responsable: "Hedi Mansouri", statut: "Complet"  },
  { id: "F003", nom: "Foyer Sousse Est",    ville: "Sousse",  capacite: 60,  occupes: 42,  responsable: "Rim Belhaj",    statut: "Actif"    },
  { id: "F004", nom: "Foyer Bizerte",       ville: "Bizerte", capacite: 45,  occupes: 10,  responsable: "Omar Tlili",    statut: "En travaux"},
  { id: "F005", nom: "Foyer Kairouan Sud",  ville: "Kairouan",capacite: 90,  occupes: 67,  responsable: "Nadia Fersi",   statut: "Actif"    },
];

const statutConfig = {
  "Actif":      { bg: "#dcfce7", color: "#16a34a" },
  "Complet":    { bg: "#dbeafe", color: "#2563eb" },
  "En travaux": { bg: "#fef9c3", color: "#ca8a04" },
};

export default function DormsPage() {
  const [search, setSearch] = useState("");

  const filtered = dormsData.filter(d =>
    d.nom.toLowerCase().includes(search.toLowerCase()) ||
    d.ville.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Gestion des Foyers</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Gérez les foyers et hébergements</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau Foyer
        </button>
      </div>

      {/* Search */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un foyer..."
          style={{ border: "none", outline: "none", fontSize: 13, color: "var(--text-primary)", flex: 1, background: "transparent" }} />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>
              {["ID","NOM","VILLE","CAPACITÉ","OCCUPÉS","RESPONSABLE","STATUT","ACTIONS"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const sc = statutConfig[f.statut] || { bg: "#f3f4f6", color: "#6b7280" };
              const pct = Math.round((f.occupes / f.capacite) * 100);
              return (
                <tr key={f.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "13px 16px", fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{f.id}</td>
                  <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{f.nom}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{f.ville}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{f.capacite}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>{f.occupes}/{f.capacite}</span>
                      <div style={{ background: "#e5e7eb", borderRadius: 99, height: 5, width: 80 }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: pct >= 95 ? "#dc2626" : pct >= 75 ? "#f59e0b" : "#16a34a" }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{f.responsable}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{f.statut}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ background: "none", border: "none", color: "#6b7280" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button style={{ background: "none", border: "none", color: "#6b7280" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
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