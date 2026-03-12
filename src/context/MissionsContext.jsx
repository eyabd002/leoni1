import { createContext, useContext, useState } from "react";

const MissionsContext = createContext(null);

const initialMissions = [
  { id: "M001", date: "15/03/2026", ville: "Tunis",    responsable: "Ahmed Benjelloun", transport: "Bus",     objectif: "45/50", statut: "Terminée"  },
  { id: "M002", date: "10/03/2026", ville: "Sfax",     responsable: "Sara El Amrani",   transport: "Minibus", objectif: "28/30", statut: "Terminée"  },
  { id: "M003", date: "12/03/2026", ville: "Sousse",   responsable: "Mohamed Alaoui",   transport: "Van",     objectif: "35/40", statut: "Terminée"  },
  { id: "M004", date: "18/03/2026", ville: "Bizerte",  responsable: "Fatima Rachidi",   transport: "Bus",     objectif: "35",    statut: "En cours"  },
  { id: "M005", date: "20/03/2026", ville: "Kairouan", responsable: "Youssef Bennis",   transport: "Minibus", objectif: "25",    statut: "Planifiée" },
];

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState(initialMissions);

  const addMission = (formData, selectedResponsables) => {
    const newId = `M${String(missions.length + 1).padStart(3, "0")}`;
    const newMission = {
      id: newId,
      date: formData.date.split("-").reverse().join("/"), // convert yyyy-mm-dd → dd/mm/yyyy
      ville: formData.ville,
      responsable: selectedResponsables.join(", "),
      transport: formData.transport,
      objectif: formData.objectif,
      statut: "Planifiée",
    };
    setMissions(prev => [...prev, newMission]);
    return newId;
  };

  return (
    <MissionsContext.Provider value={{ missions, addMission }}>
      {children}
    </MissionsContext.Provider>
  );
}

export const useMissions = () => useContext(MissionsContext);