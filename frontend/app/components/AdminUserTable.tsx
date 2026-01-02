"use client";

interface User {
  _id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

export default function AdminUserTable({ users }: { users: User[] }) {
  return (
    <div className="mt-10 admin-user-table">
      <h2 className="text-2xl font-bold mb-4">Utilisateurs</h2>

      <div className="table-container">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="user-row">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.name || "-"}</td>
                <td className="p-3 font-medium">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
