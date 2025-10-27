import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem 
} from "@mui/material";
import { createTask } from "../../api/taskApi";
import axios from "axios";

export default function TaskForm({ open, handleClose, projectId = null }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    assignee_id: "",
    due_date: "",
    project_id: ""
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch projects and users when dialog opens
  useEffect(() => {
    if (open) {
      // Fetch projects
      axios.get("http://localhost:8000/projects/", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setProjects(res.data))
        .catch(err => console.error("Failed to fetch projects:", err));

      // Fetch users for assignment dropdown
      axios.get("http://localhost:8000/users/", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUsers(res.data))
        .catch(err => console.error("Failed to fetch users:", err));
    }
  }, [open, token]);

  // Pre-fill project_id if provided via prop
  useEffect(() => {
    if (projectId) {
      setForm(f => ({ ...f, project_id: String(projectId) }));
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.project_id) {
      alert("Please select a project");
      return;
    }

    // Prepare payload
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      project_id: Number(form.project_id),
      assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
      due_date: form.due_date || null
    };

    console.log("Creating task with payload:", payload);

    try {
      await createTask(payload, token);
      alert("Task created successfully!");
      handleClose();
      // Reset form
      setForm({
        title: "",
        description: "",
        status: "pending",
        assignee_id: "",
        due_date: "",
        project_id: projectId ? String(projectId) : ""
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Title */}
          <TextField
            label="Title"
            name="title"
            fullWidth
            required
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            margin="normal"
          />

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            margin="normal"
          />

          {/* Project Selection - ALWAYS VISIBLE */}
          <TextField
            select
            label="Project"
            name="project_id"
            fullWidth
            required
            value={form.project_id}
            onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}
            margin="normal"
          >
            <MenuItem value=""><em>Select Project</em></MenuItem>
            {projects.map(proj => (
              <MenuItem value={String(proj.id)} key={proj.id}>
                {proj.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            margin="normal"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </TextField>

          {/* Due Date */}
          <TextField
            label="Due Date"
            type="date"
            name="due_date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.due_date}
            onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
            margin="normal"
          />

          {/* Assign User */}
          <TextField
            select
            label="Assign User"
            name="assignee_id"
            fullWidth
            value={form.assignee_id}
            onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
            margin="normal"
          >
            <MenuItem value=""><em>No Assignment</em></MenuItem>
            {users.map(user => (
              <MenuItem value={String(user.id)} key={user.id}>
                {user.username} ({user.email})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
