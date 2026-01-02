"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./comments.css";


interface Comment {
  _id: string;
  content: string;
  createdAt: string;
}

export default function CommentsPage() {
  const { reportId } = useParams();

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Charger les commentaires
  useEffect(() => {
    if (!token || !reportId) return;

    fetch(`http://localhost:5000/comment/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement commentaires");
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les commentaires");
        setLoading(false);
      });
  }, [reportId, token]);

  //  Ajouter un commentaire
  const handleAddComment = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/comment/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, content }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setComments([...comments, data.comment]);
      setContent("");
    } catch {
      setError("Erreur lors de l'ajout du commentaire");
    }
  };

  //  Supprimer un commentaire (admin)
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/comment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setComments(comments.filter((c) => c._id !== id));
    } catch {
      setError("Suppression impossible");
    }
  };

  if (!token) return <p className="comments-auth-message">Vous devez être connecté.</p>;

  return (
    <div className="comments-page">
      <Link href="/reports">
        <button className="comments-back-btn">
          ← Retour aux signalements
        </button>
      </Link>

      <h2 className="comments-title">Commentaires</h2>

      {loading && <p className="comments-loading">Chargement...</p>}
      {error && <p className="comments-error">{error}</p>}

      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c._id} className="comment-item">
            <p className="comment-content">{c.content}</p>
            <p className="comment-date">
              {new Date(c.createdAt).toLocaleString()}
            </p>

            {/* Bouton admin */}
            <button
              onClick={() => handleDelete(c._id)}
              className="comment-delete-btn"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <div className="comments-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="comments-textarea"
          placeholder="Ajouter un commentaire..."
        />

        <button
          onClick={handleAddComment}
          className="comments-submit-btn"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
