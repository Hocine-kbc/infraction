"use client";

import { useState } from "react";

interface SearchFilters {
  status: string;
  type: string;
  dateDebut: string;
  dateFin: string;
}

interface Props {
  onSearch: (filters: SearchFilters) => void;
}

export default function AdminFilters({ onSearch }: Props) {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  return (
    <div className="admin-filters">
      <select
        className="filter-input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Tous les statuts</option>
        <option value="soumis">Soumis</option>
        <option value="en_cours">En cours</option>
        <option value="resolu">Résolu</option>
      </select>

      <input
        type="text"
        placeholder="Type d'infraction"
        className="filter-input"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      <div className="date-filters">
        <div className="date-filter-group">
          <label className="filter-label">Date de début</label>
          <input
            type="date"
            className="filter-input"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className="date-filter-group">
          <label className="filter-label">Date de fin</label>
          <input
            type="date"
            className="filter-input"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={() => onSearch({ status, type, dateDebut, dateFin })}
        className="filter-btn"
      >
        Rechercher
      </button>
    </div>
  );
}
