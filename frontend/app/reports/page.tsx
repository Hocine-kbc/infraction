"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReportCard from "../components/ReportCard";
import { getReports, sendUserResponse } from "../../lib/api";
import "./reports.css";

interface Notification {
  message: string;
  read: boolean;
  date: string;
}

interface Report {
  _id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  status: "soumis" | "en_cours" | "resolu";
  responses?: any[];
  notifications?: Notification[];
}

export default function UserReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch((err) =>
        setMessage(err.message || "Erreur lors du chargement")
      );
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setReports(await getReports());
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendResponse = async (id: string, text: string) => {
    const updated = await sendUserResponse(id, text);
    setReports((prev) =>
      prev.map((r) => (r._id === id ? updated : r))
    );
  };

  return (
    <div className="reports-page">
      {/* Retour */}
      <Link href="/">
        <button className="btn-back-home">Retour à l'accueil</button>
      </Link>

      {/* Titre */}
      <h2 className="reports-title">Mes signalements</h2>

      {message && <p className="reports-error">{message}</p>}

      <div className="reports-list">
        {reports.map((report) => (
          <div key={report._id} className="report-wrapper">
            {/* Carte infraction */}
            <ReportCard
              report={report}
              onSendResponse={handleSendResponse}
            />

            {/* Lien commentaires */}
            <div className="comments-link-wrapper">
              <Link
                href={`/comments/${report._id}`}
                className="comments-link"
              >
                Voir / ajouter des commentaires →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
