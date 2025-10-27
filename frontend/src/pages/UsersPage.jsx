import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchUsers } from "../api/userApi";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetchUsers(user.token);
        setUsers(res.data);
      } catch {
        setError("Could not fetch users");
      }
    }
    load();
  }, [user]);

  if (!user || user.role !== "admin") return <div>Forbidden</div>;

  return (
    <div>
      <h2>User Management</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} ({u.role})</li>
        ))}
      </ul>
    </div>
  );
}
