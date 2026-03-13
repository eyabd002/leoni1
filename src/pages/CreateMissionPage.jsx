import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMissions } from "../context/MissionsContext.jsx";

// ── Data ──────────────────────────────────────────────────────────────────────
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
const gouvernorats = {
  "Tunis":       ["Tunis", "Bab El Bhar", "Bab Souika", "El Omrane", "El Menzah", "La Marsa", "Le Bardo", "Le Kram", "Carthage", "Sidi Hassine"],
  "Ariana":      ["Ariana Ville", "Ettadhamen", "Mnihla", "Ghazela", "Kalâat El Andalous", "Sidi Thabet", "La Soukra", "Raoued"],
  "Ben Arous":   ["Ben Arous", "Hammam Lif", "Hammam Chott", "Bou Mhel El Bassatine", "Ezzahra", "Radès", "Mégrine", "Mourouj", "Fouchana", "Mhamdia"],
  "Manouba":     ["Manouba", "Den Den", "Douar Hicher", "Oued Ellil", "Mornaguia", "Borj El Amri", "Djedeida", "Tébourba", "El Battan"],
  "Nabeul":      ["Nabeul", "Hammamet", "Kélibia", "Dar Chaâbane", "El Haouaria", "Menzel Temime", "Béni Khiar", "Korba", "Takelsa", "Soliman"],
  "Zaghouan":    ["Zaghouan", "Zriba", "Bir Mcherga", "El Fahs", "Nadhour", "Saouaf"],
  "Bizerte":     ["Bizerte Nord", "Bizerte Sud", "Zarzouna", "Menzel Jemil", "El Aousja", "Mateur", "Sejnane", "Joumine", "Ras Jebel", "Ghezala"],
  "Béja":        ["Béja Nord", "Béja Sud", "Testour", "Téboursouk", "Nefza", "Tibar", "Amdoun", "Mejez El Bab", "Goubellat"],
  "Jendouba":    ["Jendouba", "Jendouba Nord", "Bou Salem", "Tabarka", "Aïn Draham", "Fernana", "Ghardimaou", "Oued Mliz", "Balta-Bou Aouane"],
  "Le Kef":      ["Le Kef Ouest", "Le Kef Est", "Nebeur", "Sakiet Sidi Youssef", "Tajerouine", "Dahmani", "Sers", "Kalâat Sinane", "Kalâat Khasba"],
  "Siliana":     ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "El Krib", "Rouhia", "Kesra", "Bargou", "Makthar"],
  "Sousse":      ["Sousse Ville", "Sousse Jawhara", "Sousse Riadh", "Kalâa Sghira", "Kalâa Kébira", "Akouda", "Hammam Sousse", "Msaken", "Sidi Bou Ali", "Hergla"],
  "Monastir":    ["Monastir", "Jemmal", "Zeramdine", "Beni Hassen", "Ksar Hellal", "Moknine", "Téboulba", "Sayada", "Ouerdanine", "Sahline"],
  "Mahdia":      ["Mahdia", "El Djem", "Ksour Essef", "Chebba", "Bou Merdes", "Ouled Chamekh", "Sidi Alouane", "Essouassi", "Melloulèche", "Rejiche"],
  "Sfax":        ["Sfax Ville", "Sfax Sud", "Sakiet Ezzit", "Sakiet Eddaïer", "Gremda", "El Hencha", "Jebiniana", "Bir Ali Ben Khélifa", "Agareb", "Mahres"],
  "Kairouan":    ["Kairouan Nord", "Kairouan Sud", "Sbikha", "Chebika", "Hajeb El Ayoun", "Nasrallah", "El Ousslatia", "Bouhajla", "Haffouz", "Echbika"],
  "Kasserine":   ["Kasserine Nord", "Kasserine Sud", "Ezzouhour", "Hassi El Frid", "Sbeitla", "Sbiba", "Jedeliane", "El Ayoun", "Thélepte", "Foussana"],
  "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Jelma", "Cebbala", "Bir El Hafey", "Sidi Ali Ben Aoun", "Meknassy", "Souk Jedid", "Mezzouna"],
  "Gabès":       ["Gabès Médina", "Gabès Ouest", "Gabès Sud", "El Hamma", "Matmata", "Mareth", "Ghannouch", "Métouia", "Nouvelle Matmata", "Menzel El Habib"],
  "Médenine":    ["Médenine Nord", "Médenine Sud", "Beni Khedache", "Ben Guerdane", "Zarzis", "Jerba Houmt Souk", "Jerba Midoun", "Jerba Aghir", "Sidi Makhlouf"],
  "Tataouine":   ["Tataouine Nord", "Tataouine Sud", "Ghomrassen", "Smar", "Bir Lahmar", "Dehiba"],
  "Gafsa":       ["Gafsa", "El Ksar", "Sidi Aïch", "Metlaoui", "Redeyef", "Moularès", "Belkhir", "Sned", "Mdhilla"],
  "Tozeur":      ["Tozeur", "Degache", "Tamerza", "Hazoua", "Nefta"],
  "Kébili":      ["Kébili Nord", "Kébili Sud", "Souk Lahad", "Douz Nord", "Douz Sud", "El Faouar"],
};
const gouvernoratsList = Object.keys(gouvernorats);

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_FR   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function toKey(y, m, d)  { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function keyToLabel(key) {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
}

function buildCalendar(year, month) {
  // day-of-week: Mon=0 … Sun=6
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const today = new Date();

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateMissionPage() {
  const navigate = useNavigate();
  const { addMission } = useMissions();

  // Calendar state
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  // selectedDates: Set of "yyyy-mm-dd" keys
  const [selectedDates, setSelectedDates] = useState(new Set());

  // Step: "calendar" | "form"
  const [step, setStep] = useState("calendar");

  // Form fields
  const [form, setForm] = useState({ transport: "Sélectionner un transport", objectif: "", observations: "" });
  const [activeGouv,  setActiveGouv]  = useState(null);
  const [selections,  setSelections]  = useState({});
  const [selectedResp, setSelectedResp] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const cells = buildCalendar(calYear, calMonth);
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  // ── Calendar interactions ──────────────────────────────────────────────────
  const toggleDate = (d) => {
    if (!d) return;
    const key = toKey(calYear, calMonth, d);
    // Don't allow past dates
    if (key < todayKey) return;
    setSelectedDates(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const sortedDates = [...selectedDates].sort();

  const proceedToForm = () => {
    if (selectedDates.size === 0) return;
    setStep("form");
  };

  // ── Form interactions ──────────────────────────────────────────────────────
  const setF = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: "" })); };

  const toggleDelegation = (gouv, deleg) => {
    setSelections(prev => {
      const cur = prev[gouv] || [];
      const upd = cur.includes(deleg) ? cur.filter(d => d !== deleg) : [...cur, deleg];
      const next = { ...prev, [gouv]: upd };
      if (!next[gouv].length) delete next[gouv];
      return next;
    });
    if (errors.delegations) setErrors(p => ({ ...p, delegations: "" }));
  };

  const toggleResp = (id) => {
    setSelectedResp(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    if (errors.responsable) setErrors(p => ({ ...p, responsable: "" }));
  };

  const totalDelegations = Object.values(selections).flat().length;

  const validate = () => {
    const e = {};
    if (totalDelegations < 2)                            e.delegations = "Veuillez sélectionner au moins 2 délégations.";
    if (!selectedResp.length)                            e.responsable = "Veuillez sélectionner au moins un responsable.";
    if (form.transport === "Sélectionner un transport")  e.transport   = "Le transport est requis.";
    if (!form.objectif)                                  e.objectif    = "L'objectif est requis.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const names    = responsablesData.filter(r => selectedResp.includes(r.id)).map(r => r.nom);
    const villeStr = Object.entries(selections).map(([g, ds]) => `${g} (${ds.join(", ")})`).join(" / ");
    // Create one mission per selected date
    sortedDates.forEach(dateKey => {
      addMission({ ...form, date: dateKey.split("-").reverse().join("/") }, names, villeStr);
    });
    setSuccess(true);
    setTimeout(() => navigate("/missions"), 1600);
  };

  const conflits = responsablesData
    .filter(r => selectedResp.includes(r.id) && r.enMission)
    .map(r => ({ ...r, ...responsablesEnMission.find(m => m.nom === r.nom) }))
    .filter(r => r.mission);

  // ── RENDER: CALENDAR STEP ─────────────────────────────────────────────────
  if (step === "calendar") return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={() => navigate("/missions")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Nouvelle Mission</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Étape 1 — Sélectionnez les jours de la mission</p>
        </div>
      </div>

      {/* Calendar card */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={prevMonth} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>{MONTHS_FR[calMonth]} {calYear}</h3>
          <button onClick={nextMonth} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Days header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--border)" }}>
          {DAYS_FR.map(d => (
            <div key={d} style={{ textAlign: "center", padding: "10px 0", fontSize: 11, fontWeight: 700, color: d === "Sam" || d === "Dim" ? "#dc2626" : "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 20px" }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />;
            const key      = toKey(calYear, calMonth, d);
            const isPast   = key < todayKey;
            const isToday  = key === todayKey;
            const isSelct  = selectedDates.has(key);
            const dayOfWeek = (i % 7); // 0=Mon … 6=Sun
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

            return (
              <div key={key} onClick={() => toggleDate(d)}
                style={{
                  aspectRatio: "1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 10, margin: 3, cursor: isPast ? "not-allowed" : "pointer",
                  background: isSelct ? "#2563eb" : isToday ? "#eff6ff" : "transparent",
                  border: isToday && !isSelct ? "2px solid #2563eb" : isSelct ? "none" : "2px solid transparent",
                  transition: "all 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!isPast && !isSelct) e.currentTarget.style.background = "#f3f4f6"; }}
                onMouseLeave={e => { if (!isPast && !isSelct) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  fontSize: 14, fontWeight: isSelct ? 800 : isToday ? 700 : 500,
                  color: isSelct ? "#fff" : isPast ? "#d1d5db" : isToday ? "#2563eb" : isWeekend ? "#ef4444" : "#111827",
                }}>
                  {d}
                </span>
                {isSelct && (
                  <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: "#93c5fd" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, padding: "12px 28px", borderTop: "1px solid var(--border)", background: "#f9fafb" }}>
          {[
            { color: "#2563eb", bg: "#2563eb", label: "Sélectionné" },
            { color: "#2563eb", bg: "#eff6ff", border: "2px solid #2563eb", label: "Aujourd'hui" },
            { color: "#d1d5db", bg: "transparent", label: "Passé (non disponible)" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: l.border || "none" }} />
              <span style={{ fontSize: 11, color: "#6b7280" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected dates summary */}
      {sortedDates.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 24px", marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
              {sortedDates.length} jour{sortedDates.length > 1 ? "s" : ""} sélectionné{sortedDates.length > 1 ? "s" : ""}
            </span>
            <button onClick={() => setSelectedDates(new Set())} style={{ fontSize: 11, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Tout effacer
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sortedDates.map(k => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {keyToLabel(k)}
                <button onClick={() => { const n = new Set(selectedDates); n.delete(k); setSelectedDates(n); }} style={{ background: "none", border: "none", color: "#93c5fd", cursor: "pointer", padding: 0, display: "flex" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
        <button onClick={() => navigate("/missions")} style={{ padding: "10px 24px", border: "1px solid var(--border)", borderRadius: 8, background: "#f9fafb", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Annuler
        </button>
        <button onClick={proceedToForm} disabled={!selectedDates.size}
          style={{ padding: "10px 28px", border: "none", borderRadius: 8, background: selectedDates.size ? "#2563eb" : "#d1d5db", color: "#fff", fontSize: 13, fontWeight: 700, cursor: selectedDates.size ? "pointer" : "not-allowed", boxShadow: selectedDates.size ? "0 2px 8px rgba(37,99,235,0.35)" : "none", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
          Continuer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );

  // ── RENDER: FORM STEP ─────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setStep("calendar")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Nouvelle Mission</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Étape 2 — Remplissez les détails de la mission</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[{ n: 1, label: "Dates" }, { n: 2, label: "Détails" }].map(s => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.n === 1 ? "#dcfce7" : "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {s.n === 1
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>2</span>}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: s.n === 2 ? "#2563eb" : "#16a34a" }}>{s.label}</span>
            {s.n < 2 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>}
          </div>
        ))}
      </div>

      {/* Success */}
      {success && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>{sortedDates.length} mission{sortedDates.length > 1 ? "s" : ""} créée{sortedDates.length > 1 ? "s" : ""} avec succès ! Redirection...</span>
        </div>
      )}

      {/* Selected dates recap */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", marginRight: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 4 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Jours sélectionnés :
        </span>
        {sortedDates.map(k => (
          <span key={k} style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{keyToLabel(k)}</span>
        ))}
        <button onClick={() => setStep("calendar")} style={{ marginLeft: "auto", fontSize: 11, color: "#2563eb", background: "none", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
          Modifier
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>

        {/* Gouvernorats & Délégations */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
              Gouvernorats & Délégations <span style={{ color: "#dc2626" }}>*</span>
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#6b7280" }}>(min. 2 délégations — {totalDelegations} sélectionnée{totalDelegations !== 1 ? "s" : ""})</span>
            </label>
          </div>

          {/* Pills */}
          {Object.keys(selections).length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.keys(selections).map(g => (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "5px 10px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>{g}</span>
                  <span style={{ background: "#dbeafe", color: "#2563eb", borderRadius: 99, padding: "1px 7px", fontSize: 10, fontWeight: 800 }}>{selections[g].length}</span>
                  <button onClick={() => { setSelections(p => { const n={...p}; delete n[g]; return n; }); if (activeGouv===g) setActiveGouv(null); }} style={{ background: "none", border: "none", color: "#93c5fd", cursor: "pointer", padding: 0, display: "flex" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Two-panel */}
          <div style={{ border: `1px solid ${errors.delegations ? "#dc2626" : "var(--border)"}`, borderRadius: 10, overflow: "hidden", display: "flex", height: 300 }}>
            {/* Left — gouvernorats */}
            <div style={{ width: 190, flexShrink: 0, borderRight: "1px solid var(--border)", overflowY: "auto", background: "#f9fafb" }}>
              {gouvernoratsList.map(g => {
                const isActive   = activeGouv === g;
                const hasSel     = selections[g]?.length > 0;
                return (
                  <div key={g} onClick={() => setActiveGouv(g)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#1d4ed8" : hasSel ? "#374151" : "#6b7280", background: isActive ? "#eff6ff" : "transparent", borderLeft: `3px solid ${isActive ? "#2563eb" : "transparent"}`, borderBottom: "1px solid var(--border)", transition: "all 0.1s" }}>
                    <span>{g}</span>
                    {hasSel && <span style={{ background: "#2563eb", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 800, padding: "1px 6px" }}>{selections[g].length}</span>}
                  </div>
                );
              })}
            </div>

            {/* Right — delegations */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {!activeGouv ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af", gap: 8 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <p style={{ fontSize: 13 }}>Sélectionnez un gouvernorat</p>
                </div>
              ) : (
                <div>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{activeGouv}
                      <span style={{ marginLeft: 6, fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
                        {(selections[activeGouv]||[]).length}/{gouvernorats[activeGouv].length} sélectionnées
                      </span>
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelections(p => ({ ...p, [activeGouv]: [...gouvernorats[activeGouv]] }))} style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>Tout</button>
                      {(selections[activeGouv]||[]).length > 0 && <button onClick={() => setSelections(p => { const n={...p}; delete n[activeGouv]; return n; })} style={{ fontSize: 11, fontWeight: 600, color: "#dc2626", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>Effacer</button>}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: 4 }}>
                    {gouvernorats[activeGouv].map(deleg => {
                      const isChk = (selections[activeGouv]||[]).includes(deleg);
                      return (
                        <div key={deleg} onClick={() => toggleDelegation(activeGouv, deleg)}
                          style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", cursor: "pointer", borderRadius: 6, background: isChk ? "#eff6ff" : "transparent", margin: 2 }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `2px solid ${isChk ? "#2563eb" : "#d1d5db"}`, background: isChk ? "#2563eb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isChk && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: isChk ? 600 : 400, color: isChk ? "#1d4ed8" : "#374151" }}>{deleg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {errors.delegations && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{errors.delegations}</p>}
        </div>

        {/* Responsables */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 10 }}>Responsable de mission <span style={{ color: "#dc2626" }}>*</span></label>
          <div style={{ border: `1px solid ${errors.responsable ? "#dc2626" : "var(--border)"}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {responsablesData.map((r, i) => {
                const isSel = selectedResp.includes(r.id);
                return (
                  <div key={r.id} onClick={() => toggleResp(r.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < 3 ? "1px solid var(--border)" : "none", borderRight: i%2===0 ? "1px solid var(--border)" : "none", cursor: "pointer", background: isSel ? "#eff6ff" : "#fff", transition: "background 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `2px solid ${isSel ? "#2563eb" : "#d1d5db"}`, background: isSel ? "#2563eb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isSel && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{r.nom}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.ville}</div>
                    </div>
                    {r.enMission && <span style={{ fontSize: 10, fontWeight: 700, background: "#fff7ed", color: "#ea580c", borderRadius: 99, padding: "2px 8px", border: "1px solid #fed7aa", whiteSpace: "nowrap" }}>En mission</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {errors.responsable && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{errors.responsable}</p>}
        </div>

        {/* Transport + Objectif */}
        <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Moyen de transport <span style={{ color: "#dc2626" }}>*</span></label>
            <select value={form.transport} onChange={e => setF("transport", e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${errors.transport ? "#dc2626" : "var(--border)"}`, borderRadius: 8, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", color: form.transport === "Sélectionner un transport" ? "#9ca3af" : "#111827" }}>
              {transports.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.transport && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{errors.transport}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Objectif de recrutement <span style={{ color: "#dc2626" }}>*</span></label>
            <input type="number" min="1" value={form.objectif} onChange={e => setF("objectif", e.target.value)}
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
          <textarea value={form.observations} onChange={e => setF("observations", e.target.value)}
            placeholder="Notes ou commentaires supplémentaires..." rows={3}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e  => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={() => setStep("calendar")} style={{ padding: "9px 24px", border: "1px solid var(--border)", borderRadius: 8, background: "#f9fafb", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ← Retour
          </button>
          <button onClick={handleSave} style={{ padding: "9px 28px", border: "none", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
            Enregistrer
          </button>
        </div>
      </div>

      {/* Conflits */}
      {conflits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #fed7aa", borderRadius: 12, padding: "22px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Responsables actuellement en mission</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["RESPONSABLE","RÉGION","MISSION","VILLE","DATE"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {conflits.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < conflits.length-1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "11px 12px", fontWeight: 600, fontSize: 13 }}>{r.nom}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: "#6b7280" }}>{r.region}</td>
                  <td style={{ padding: "11px 12px" }}><span style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{r.mission}</span></td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: "#6b7280" }}>{r.ville}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: "#6b7280" }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}>
            Ces responsables peuvent être assignés mais veuillez vérifier qu'il n'y a pas de conflit de dates.
          </div>
        </div>
      )}
    </div>
  );
}