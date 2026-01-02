"use client";

import { useState } from "react";

interface Response {
  message: string;
  adminId: string;
  date: string;
}

interface ReportCardProps {
  report: {
    _id: string;
    type: string;
    description: string;
    location: string;
    date: string;
    status: "soumis" | "en_cours" | "resolu";
    responses?: Response[];
  };
  onSendResponse: (id: string, message: string) => void;
}

export default function ReportCard({ report, onSendResponse }: ReportCardProps) {
  const [responseText, setResponseText] = useState("");

  const handleSend = () => {
    if (!responseText.trim()) return;
    onSendResponse(report._id, responseText);
    setResponseText("");
  };

  // Récupérer l'ID utilisateur depuis le token
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();
  const sentComments = report.responses?.filter((r) => r.adminId === userId) || [];
  const receivedResponses = report.responses?.filter((r) => r.adminId !== userId) || [];

  return (
    <div className="user-report-card mb-4">
      {/* Type et infos principales */}
      <div className="user-report-info">
        <div className="info-card">
          <span className="info-label">Type</span>
          <span className="info-value">{report.type}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Description</span>
          <span className="info-value">{report.description}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Lieu</span>
          <span className="info-value">{report.location}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Date</span>
          <span className="info-value">{new Date(report.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Commentaires envoyés */}
      {sentComments.length > 0 && (
        <div className="user-responses mt-4">
          <h4>Mes commentaires envoyés :</h4>
          <ul>
            {sentComments.map((r, idx) => (
              <li key={idx}>
                {r.message}
                <span>    {new Date(r.date).toLocaleString()}    </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Réponses reçues */}
      {receivedResponses.length > 0 && (
        <div className="user-responses mt-4">
          <h4>Réponses reçues :</h4>
          <ul>
            {receivedResponses.map((r, idx) => (
              <li key={idx}>
                {r.message}
                <span>    {new Date(r.date).toLocaleString()}    </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input pour ajouter une réponse */}
      <div className="user-response-input mt-2 flex">
        <input
          type="text"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Envoyer une réponse..."
          className="flex-1"
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}
