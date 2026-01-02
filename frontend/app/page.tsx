"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./home.css";

export default function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => console.log("Backend health:", data))
      .catch((err) => console.error("Erreur backend:", err));

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error("Erreur décodage token :", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="hero">
      <div className="hero-card">
        {isLoggedIn && (
          <button onClick={handleLogout} className="btn-logout">
            Se déconnecter
          </button>
        )}

        <h1 className="hero-title">
          Application de Signalement des Infractions
        </h1>

        <p className="hero-text">
          Une plateforme sécurisée et moderne permettant aux citoyens de
          signaler des infractions, suivre leurs dossiers et collaborer
          efficacement avec les autorités compétentes.
        </p>

        <div className="hero-buttons">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="btn-glow primary">Se connecter</button>
              </Link>

              <Link href="/register">
                <button className="btn-glow success">S'inscrire</button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/reports">
                <button className="btn-glow primary">Mes signalements</button>
              </Link>

              <Link href="/reports/create">
                <button className="btn-glow outline">Créer un signalement</button>
              </Link>

              {userRole === "admin" && (
                <Link href="/admin">
                  <button className="btn-glow admin">Dashboard Admin</button>
                </Link>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
