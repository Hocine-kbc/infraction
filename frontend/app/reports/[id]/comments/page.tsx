"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


interface Comment {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export default function CommentsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("Chargement...");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5000/comment/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setMessage("");
      })
      .catch(() => {
        setMessage("Erreur lors du chargement des commentaires");
      });
  }, [reportId, token, router]);

  const addComment = async () => {
    if (!content.trim()) return;

    const res = await fetch(`http://localhost:5000/comment/${reportId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      alert("Erreur lors de l'ajout du commentaire");
      return;
    }

    const newComment = await res.json();
    setComments((prev) => [newComment, ...prev]);
    setContent("");
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Supprimer ce commentaire ?")) return;

    const res = await fetch(`http://localhost:5000/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erreur lors de la suppression");
      return;
    }

    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="comments-container">
      <button onClick={() => router.back()} className="btn-back">
        ← Retour
      </button>

      <h2 className="comments-title">Commentaires</h2>

      {message && <p className="comments-message">{message}</p>}

      {/* Ajouter commentaire */}
      <div className="add-comment">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter un commentaire..."
        />
        <button onClick={addComment} className="btn-primary">
          Ajouter
        </button>
      </div>

      {/* Liste commentaires */}
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment._id} className="comment-card">
            <p>{comment.content}</p>
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
            <button
              onClick={() => deleteComment(comment._id)}
              className="btn-delete"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
