"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";


interface Comment {
  _id: string;
  content: string;
  createdAt: string;
}

export default function CommentsPage() {
  const { reportId } = useParams();
  const router = useRouter();

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

  if (!token) return <p className="p-6">Vous devez être connecté.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Link href="/reports">
        <button className="mb-4 text-sm text-blue-600 hover:underline">
          ← Retour aux signalements
        </button>
      </Link>

      <h2 className="text-2xl font-bold mb-4">Commentaires</h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3 mb-6">
        {comments.map((c) => (
          <li key={c._id} className="border p-3 rounded">
            <p>{c.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>

            {/* Bouton admin */}
            <button
              onClick={() => handleDelete(c._id)}
              className="text-red-600 text-xs mt-1 hover:underline"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Ajouter un commentaire..."
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
