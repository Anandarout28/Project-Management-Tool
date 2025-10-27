import React, { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";

export default function AssignUserDropdown({ taskId, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState("");

  useEffect(() => {
    fetch("/users/").then(res => res.json()).then(setUsers);
    // Optionally, fetch current assignment
  }, []);

  const assignUser = userId => {
    fetch(`/tasks/${taskId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    }).then(() => { setAssigned(userId); onUpdated(); });
  };

  return (
    <Select
      value={assigned}
      displayEmpty
      size="small"
      onChange={e => assignUser(e.target.value)}
      sx={{ mr: 1 }}
    >
      <MenuItem value="">
        <em>Assign</em>
      </MenuItem>
      {users.map(u => (
        <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
      ))}
    </Select>
  );
}
