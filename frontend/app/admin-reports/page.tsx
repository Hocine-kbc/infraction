"use client";
import { useEffect, useState } from "react";
import "./admin-reports.css";

const API_URL = "http://172.20.10.4:5000";

interface Report {
  _id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  status: "soumis" | "en_cours" | "resolu";
}

async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, { ...options, headers, cache: "no-store" });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur API");
  }

  return res.json();
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState("Chargement...");

  const loadReports = () => {
    fetchWithToken(`${API_URL}/report/all`)
      .then((data) => {
        setReports(data);
        setMessage("");
      })
      .catch((err) => setMessage("Erreur : " + err.message));
  };

  const updateStatus = (id: string, status: Report["status"]) => {
    fetchWithToken(`${API_URL}/report/status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
      .then(() => loadReports())
      .catch((err) => setMessage("Erreur : " + err.message));
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="admin-reports-container">
      <h1 className="admin-reports-title">Gestion des signalements (Admin)</h1>
      {message && <p className="admin-reports-message">{message}</p>}

      <div className="reports-grid">
        {reports.map((r) => (
          <div key={r._id} className="report-card">
            <div className="report-header">
              <strong>{r.type}</strong>
              <span className={`status ${r.status}`}>{r.status}</span>
            </div>
            <p className="report-desc">{r.description}</p>
            <p className="report-location">{r.location}</p>
            <p className="report-date">{new Date(r.date).toLocaleDateString()}</p>

            <div className="status-buttons">
              {r.status !== "soumis" && (
                <button className="btn btn-soumis" onClick={() => updateStatus(r._id, "soumis")}>
                  Soumis
                </button>
              )}
              {r.status !== "en_cours" && (
                <button className="btn btn-encours" onClick={() => updateStatus(r._id, "en_cours")}>
                  En cours
                </button>
              )}
              {r.status !== "resolu" && (
                <button className="btn btn-resolu" onClick={() => updateStatus(r._id, "resolu")}>
                  Résolu
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
