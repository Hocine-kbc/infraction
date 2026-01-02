"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MapNoSSR from "../../components/MapNoSSR";
import "./create-report.css";

const API_URL = "http://localhost:5000";

export default function CreateReportPage() {
  const [type, setType] = useState("Vol");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Envoi du signalement...");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Utilisateur non authentifié");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/report/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, description, location, date }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signalement créé avec succès !");
        setTimeout(() => router.push("/reports"), 1500);
      } else {
        setMessage("Erreur : " + data.message);
      }
    } catch (err: any) {
      setMessage("Erreur : " + err.message);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <Link href="/">
          <button className="btn-back-create">Retour à l'accueil</button>
        </Link>

        <h2 className="report-title">Créer un signalement</h2>
        <p className="report-subtitle">
          Signalez une infraction de manière sécurisée et confidentielle
        </p>

        <form className="report-form" onSubmit={handleSubmit}>

          {/* Type */}
          <div className="input-group">
            <label>Type d’infraction</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Vol</option>
              <option>Agression</option>
              <option>Vandalisme</option>
              <option>Fraude</option>
              <option>Autre</option>
            </select>
          </div>

          {/* Description */}
          <div className="input-group">
            <label>Description</label>
            <textarea
              rows={4}
              placeholder="Décrivez précisément les faits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Lieu */}
          <div className="input-group">
            <label>Lieu</label>
            <input
              type="text"
              placeholder="Adresse ou lieu de l’infraction"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Carte */}
          {location && (
            <div className="map-wrapper">
              <MapNoSSR lat={48.8566} lng={2.3522} label={location} />
            </div>
          )}

          {/* Date */}
          <div className="input-group">
            <label>Date de l’infraction</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="report-btn">
            Envoyer le signalement
          </button>
        </form>

        {message && <p className="report-message">{message}</p>}

      </div>
    </div>
  );
}
