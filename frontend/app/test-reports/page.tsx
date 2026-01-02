"use client";

import { useEffect, useState } from "react";
import { getReports } from "@/lib/api";

export default function TestReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [message, setMessage] = useState("Chargement...");

  useEffect(() => {
    getReports()
      .then((data) => {
        console.log("Données reçues :", data);
        if (data.length === 0) setMessage("Aucun signalement trouvé");
        else setMessage("");
        setReports(data);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setMessage("Erreur : " + err.message);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test récupération des signalements</h1>
      {message && <p>{message}</p>}
      <ul>
        {reports.map((r) => (
          <li key={r._id}>
            {r.type} - {r.description} - {r.status} - {new Date(r.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
