const API_URL = "http://localhost:5000/admin";

export async function getAllUsers(token: string) {
  const res = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Accès admin refusé");
  }

  return res.json();
}
