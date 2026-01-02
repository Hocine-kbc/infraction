"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; 
import {
  getAllReports,
  updateReportStatus,
  searchReports,
} from "../../lib/adminApi";
import { getAllUsers } from "../../lib/adminUserApi"; 
import AdminReportCard from "../components/AdminReportCard";
import AdminFilters from "../components/AdminFilters";
import AdminUserTable from "../components/AdminUserTable"; 
import "./admin-dashboard.css";

type View = "reports" | "users" | "search";

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState<View>("reports");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token admin manquant");
      return;
    }

    getAllReports(token)
      .then((data) => setReports(data))
      .catch(() => setMessage("Accès admin refusé"));

    getAllUsers(token)
      .then((data) => setUsers(data))
      .catch(() =>
        setMessage("Erreur lors du chargement des utilisateurs")
      );
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await updateReportStatus(id, status as any, token);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      setMessage("Statut mis à jour");
    } catch (err) {
      setMessage("Erreur mise à jour statut");
      console.error(err);
    }
  };

  const handleSearch = async (filters: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data = await searchReports(filters, token);
      setReports(data);
      setActiveView("reports");
    } catch (err) {
      setMessage("Erreur lors de la recherche");
      console.error(err);
    }
  };

  const handleSendResponse = async (id: string, message: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/report/${id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Erreur envoi réponse");
      const updatedReport = await res.json();
      setReports((prev) => prev.map(r => r._id === id ? updatedReport : r));
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'envoi de la réponse");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-nav-container">
        <Link href="/">
          <button className="btn-back">Retour à l&apos;accueil</button>
        </Link>
      </div>

      <h1 className="admin-dashboard-title">Dashboard Admin</h1>

      {message && <p className="admin-dashboard-message">{message}</p>}

      <div className="dashboard-menu mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setActiveView("reports")}
          className={activeView === "reports" ? "active" : ""}
        >
          Liste des rapports
        </button>
        <button
          onClick={() => setActiveView("users")}
          className={activeView === "users" ? "active" : ""}
        >
          Liste des utilisateurs
        </button>
        <button
          onClick={() => setActiveView("search")}
          className={activeView === "search" ? "active" : ""}
        >
          Recherche de signalements
        </button>
      </div>

      {activeView === "reports" && (
        <div>
          {reports.length === 0 ? (
            <p className="no-reports">Aucun signalement trouvé.</p>
          ) : (
            <div className="reports-grid">
              {reports.map((report) => (
                <AdminReportCard
                  key={report._id}
                  report={report}
                  onStatusChange={handleStatusChange}
                  onSendResponse={handleSendResponse}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === "users" && users.length > 0 && (
        <AdminUserTable users={users} />
      )}

      {activeView === "search" && <AdminFilters onSearch={handleSearch} />}
    </div>
  );
}
