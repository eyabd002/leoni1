import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMissions } from "../context/MissionsContext.jsx";

const responsablesData = [
  { id: 1, nom: "Ahmed Benjelloun", ville: "Tunis",    enMission: false },
  { id: 2, nom: "Sara El Amrani",   ville: "Sfax",     enMission: true  },
  { id: 3, nom: "Mohamed Alaoui",   ville: "Sousse",   enMission: false },
  { id: 4, nom: "Fatima Rachidi",   ville: "Bizerte",  enMission: true  },
  { id: 5, nom: "Youssef Bennis",   ville: "Kairouan", enMission: false },
];

const responsablesEnMission = [
  { nom: "Sara El Amrani", region: "Sfax",    mission: "M002", ville: "Sfax",    date: "10/03/2026" },
  { nom: "Fatima Rachidi", region: "Bizerte", mission: "M004", ville: "Bizerte", date: "18/03/2026" },
];

const transports = ["Sélectionner un transport", "Bus", "Minibus", "Van", "Voiture de service"];
const villes     = ["Tunis", "Sfax", "Sousse", "Bizerte", "Kairouan", "Gabès", "Gafsa", "Nabeul"];

export default function CreateMissionPage() {
  const navigate    = useNavigate();
  const { addMission } = useMissions();

  const [form, setForm] = useState({
    date: "", ville: "",
    transport: "Sélectionner un transport",
    objectif: "", observations: "",
  });
  const [selectedResp, setSelectedResp] = useState([]);
  const [errors, setErrors]             = useState({});
  const [success, setSuccess]           = useState(false);

  const toggleResp = (id) => {
    setSelectedResp(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    if (errors.responsable) setErrors(p => ({ ...p, responsable: "" }));
  };

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.date)                                     e.date        = "La date est requise.";
    if (!form.ville)                                    e.ville       = "La ville est requise.";
    if (selectedResp.length === 0)                      e.responsable = "Veuillez sélectionner au moins un responsable";
    if (form.transport === "Sélectionner un transport") e.transport   = "Le transport est requis.";
    if (!form.objectif)                                 e.objectif    = "L'objectif est requis.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const selectedNames = responsablesData
      .filter(r => selectedResp.includes(r.id))
      .map(r => r.nom);

    const newId = addMission(form, selectedNames);

    // Show success banner then redirect
    setSuccess(newId);
    setTimeout(() => navigate("/missions"), 1500);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate("/missions")} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: 7,
          width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-secondary)", cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Créer une Mission</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Remplissez les informations de la nouvelle mission</p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
            Mission <strong>{success}</strong> créée avec succès ! Redirection en cours...
          </span>
        </div>
      )}

      {/* Form card */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>

        {/* Date + Ville */}
        <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Date de mission <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors.date ? "#dc2626" : "var(--border)"}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e  => e.target.style.borderColor = errors.date ? "#dc2626" : "var(--border)"}
            />
            {errors.date && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{errors.date}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Ville <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <select value={form.ville} onChange={e => set("ville", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors.ville ? "#dc2626" : "var(--border)"}`, borderRadius: 8, fontSize: 13, color: form.ville ? "var(--text-primary)" : "#9ca3af", outline: "none", background: "#fff", boxSizing: "border-box" }}>
              <option value="">Sélectionner une ville</option>
              {villes.map(v => <option key={v}>{v}</option>)}
            </select>
            {errors.ville && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{errors.ville}</p>}
          </div>
        </div>

        {/* Responsables */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 10 }}>
            Responsable de mission <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div style={{ border: `1px solid ${errors.responsable ? "#dc2626" : "var(--border)"}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {responsablesData.map((r, i) => {
                const isSelected = selectedResp.includes(r.id);
                const isBottomRow = i >= responsablesData.length - (responsablesData.length % 2 === 0 ? 2 : 1);
                return (
                  <div key={r.id} onClick={() => toggleResp(r.id)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    borderBottom: !isBottomRow ? "1px solid var(--border)" : "none",
                    borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    background: isSelected ? "#eff6ff" : "#fff",
                    transition: "background 0.15s",
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: `2px solid ${isSelected ? "#2563eb" : "#d1d5db"}`, background: isSelected ? "#2563eb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{r.nom}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.ville}</div>
                    </div>
                    {r.enMission && (
                      <span style={{ fontSize: 10, fontWeight: 700, background: "#fff7ed", color: "#ea580c", borderRadius: 99, padding: "2px 8px", border: "1px solid #fed7aa", whiteSpace: "nowrap" }}>
                        En mission
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {errors.responsable && (
            <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.responsable}
            </p>
          )}
        </div>

        {/* Transport + Objectif */}
        <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Moyen de transport <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <select value={form.transport} onChange={e => set("transport", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors.transport ? "#dc2626" : "var(--border)"}`, borderRadius: 8, fontSize: 13, color: form.transport === "Sélectionner un transport" ? "#9ca3af" : "var(--text-primary)", outline: "none", background: "#fff", boxSizing: "border-box" }}>
              {transports.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.transport && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{errors.transport}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Objectif de recrutement <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input type="number" min="1" value={form.objectif} onChange={e => set("objectif", e.target.value)}
              placeholder="Nombre de candidats"
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors.objectif ? "#dc2626" : "var(--border)"}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e  => e.target.style.borderColor = errors.objectif ? "#dc2626" : "var(--border)"}
            />
            {errors.objectif && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{errors.objectif}</p>}
          </div>
        </div>

        {/* Observations */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Observations</label>
          <textarea value={form.observations} onChange={e => set("observations", e.target.value)}
            placeholder="Notes ou commentaires supplémentaires..." rows={5}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e  => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={() => navigate("/missions")} style={{ padding: "9px 24px", border: "1px solid var(--border)", borderRadius: 8, background: "#f9fafb", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Annuler
          </button>
          <button onClick={handleSave} style={{ padding: "9px 24px", border: "none", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
            Enregistrer
          </button>
        </div>
      </div>

      {/* Responsables en mission — only shows when a selected person is already en mission */}
      {(() => {
        const conflits = responsablesData
          .filter(r => selectedResp.includes(r.id) && r.enMission)
          .map(r => {
            const detail = responsablesEnMission.find(m => m.nom === r.nom);
            return detail ? { ...r, ...detail } : null;
          })
          .filter(Boolean);

        if (conflits.length === 0) return null;

        return (
          <div style={{ background: "#fff", border: "1px solid #fed7aa", borderRadius: 12, padding: "22px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Responsables actuellement en mission</h3>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{conflits.length} responsable{conflits.length > 1 ? "s" : ""} en mission aujourd'hui</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["RESPONSABLE","RÉGION","MISSION EN COURS","VILLE","DATE"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {conflits.map((r, i) => (
                  <tr key={i} style={{ borderBottom: i < conflits.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px", fontWeight: 600, fontSize: 13 }}>{r.nom}</td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--text-secondary)" }}>{r.region}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{r.mission}</span>
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--text-secondary)" }}>{r.ville}</td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--text-secondary)" }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p style={{ fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}>
                Ces responsables peuvent être assignés à de nouvelles missions, mais veuillez vérifier qu'il n'y a pas de conflit de dates.
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}