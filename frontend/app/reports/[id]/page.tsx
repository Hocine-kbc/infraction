import { getReportById } from "@/lib/api";
import { cookies } from "next/headers";
import Link from "next/link";
import "./report-detail.css";

interface Report {
  _id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
}

async function getComments(reportId: string, token: string) {
  const res = await fetch(`http://localhost:5000/comment/${reportId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Erreur lors de la récupération des commentaires");
  return res.json();
}

export default async function ReportDetailPage({
  params,
}: {
  params: { id: string | string[] };
}) {
  const reportId = Array.isArray(params.id) ? params.id[0] : params.id;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return <p className="error-text">Vous devez être connecté.</p>;

  let report: Report | null = null;
  try {
    report = await getReportById(reportId);
  } catch {
    return <p className="error-text">Erreur lors de la récupération.</p>;
  }

  if (!report) return <p className="error-text">Signalement introuvable.</p>;

  let comments: Comment[] = [];
  try {
    comments = await getComments(reportId, token);
  } catch (err) {
    console.error("Erreur commentaires :", err);
  }

  return (
    <div className="detail-container">
      <div className="detail-card">

        <h2 className="detail-title">Détail du signalement</h2>

        {/* Infos signalement */}
        <div className="report-info">
          <div className="info-row">
            <span>Type</span>
            <strong>{report.type}</strong>
          </div>

          <div className="info-row">
            <span>Description</span>
            <p>{report.description}</p>
          </div>

          <div className="info-row">
            <span>Statut</span>
            <span className={`status ${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>

          <div className="info-date">
            Créé le {new Date(report.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Commentaires */}
        <div className="comments-section">
          <h3>Commentaires</h3>

          {comments.length === 0 && (
            <p className="empty-text">Aucun commentaire pour le moment.</p>
          )}

          <ul className="comments-list">
            {comments.map((c) => (
              <li key={c._id} className="comment-card">
                <p>{c.content}</p>
                <span>
                  Posté le {new Date(c.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="detail-actions">
          <Link href="/reports">
            <button className="btn primary">Mes signalements</button>
          </Link>

          <Link href="/">
            <button className="btn secondary">Accueil</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
