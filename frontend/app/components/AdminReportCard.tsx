"use client";

import React, { useState } from "react";

interface Notification {
  message: string;
  read: boolean;
  date: string;
}

interface Response {
  message: string;
  adminId: string;
  date: string;
}

interface AdminReportCardProps {
  report: {
    _id: string;
    type: string;
    description: string;
    location: string;
    date: string;
    status: "soumis" | "en_cours" | "resolu";
    userId: string;
    notifications?: Notification[];
    responses?: Response[];
  };
  onStatusChange: (id: string, status: string) => void;
  onSendResponse: (id: string, message: string) => void;
}

export default function AdminReportCard({
  report,
  onStatusChange,
  onSendResponse,
}: AdminReportCardProps) {
  const [responseText, setResponseText] = useState("");

  const handleSend = () => {
    if (!responseText.trim()) return;
    onSendResponse(report._id, responseText);
    setResponseText("");
  };

  return (
    <div className="admin-report-card">
      <div className="report-header">
        <h3 className="report-type">{report.type}</h3>
        <span className={`report-status status-${report.status}`}>
          {report.status}
        </span>
      </div>

      <p className="report-desc">{report.description}</p>
      <p className="report-location">
        <strong>Lieu :</strong> {report.location}
      </p>
      <p className="report-date">
        <strong>Date :</strong> {new Date(report.date).toLocaleDateString()}
      </p>

      <div className="status-select">
        <label><strong>Changer le statut :</strong></label>
        <select
          value={report.status}
          onChange={(e) => onStatusChange(report._id, e.target.value)}
          className="status-dropdown"
        >
          <option value="soumis">Soumis</option>
          <option value="en_cours">En cours</option>
          <option value="resolu">Résolu</option>
        </select>
      </div>

      {report.notifications && report.notifications.length > 0 && (
        <div className="report-notifications">
          <h4>Notifications :</h4>
          <ul>
            {report.notifications.map((n, idx) => (
              <li
                key={idx}
                className={n.read ? "text-gray-400" : "text-black font-medium"}
              >
                {n.message} - {new Date(n.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.responses && report.responses.length > 0 && (
        <div className="report-responses">
          <h4>Réponses :</h4>
          <ul>
            {report.responses.map((r, idx) => (
              <li key={idx}>
                {r.message} - {new Date(r.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="response-input">
        <input
          type="text"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Envoyer une réponse..."
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}
