"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Connexion en cours...");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Connexion réussie !");
        localStorage.setItem("token", data.token);
        router.push("/reports");
      } else {
        setMessage("Erreur : " + data.message);
      }
    } catch (err: any) {
      setMessage("Erreur : " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Connexion</h2>
        <p className="login-subtitle">
          Accédez à votre espace de signalement sécurisé
        </p>

        <form className="login-form" onSubmit={handleLogin}>
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

          <button className="login-btn">
            Se connecter
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <div className="login-footer">
          <p className="login-footer-text">
            Pas encore de compte ?{" "}
            <Link href="/register" className="login-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
