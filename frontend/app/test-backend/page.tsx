"use client";
import { useEffect, useState } from "react";

export default function TestBackendPage() {
  const [message, setMessage] = useState<string>("Chargement...");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Erreur : " + err.message));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test Backend</h1>
      <p>{message}</p>
    </div>
  );
}
