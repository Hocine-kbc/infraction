"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Inscription en cours...");

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Inscription réussie ! Redirection vers la connexion...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage("Erreur : " + data.message);
      }
    } catch (err: any) {
      setMessage("Erreur : " + err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2 className="register-title">Créer un compte</h2>
        <p className="register-subtitle">
          Rejoignez la plateforme officielle de signalement des infractions
        </p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nom</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-btn">
            S’inscrire
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="register-footer">
          Déjà un compte ?{" "}
          <a href="/login">Se connecter</a>
        </p>

      </div>
    </div>
  );
}
