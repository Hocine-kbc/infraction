const API_URL = "http://localhost:5000/report";

export async function getAllReports(token: string) {
  const res = await fetch(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Accès admin refusé");
  return res.json();
}

export async function updateReportStatus(
  id: string,
  status: "soumis" | "en_cours" | "resolu",
  token: string
) {
  const res = await fetch(`${API_URL}/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erreur mise à jour statut");
  return res.json();
}

export async function searchReports(
  filters: { status?: string; type?: string; dateDebut?: string; dateFin?: string },
  token: string
) {
  const query = new URLSearchParams(filters as any).toString();
  const res = await fetch(`${API_URL}/search?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur recherche signalements");
  return res.json();
}

export async function sendAdminResponse(reportId: string, message: string, token: string) {
  const res = await fetch(`${API_URL}/admin/${reportId}/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Erreur envoi réponse admin");
  return res.json();
}
