const API_URL = "http://localhost:5000";

// Sécurité : vérifier qu'on est côté client
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur lors de la requête API");
  }

  return res.json();
}

export async function getReports() {
  return fetchWithToken(`${API_URL}/report/my-reports`);
}

export async function getReportById(id: string) {
  return fetchWithToken(`${API_URL}/report/${id}`);
}

export async function sendUserResponse(reportId: string, message: string) {
  return fetchWithToken(`${API_URL}/report/${reportId}/respond`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
