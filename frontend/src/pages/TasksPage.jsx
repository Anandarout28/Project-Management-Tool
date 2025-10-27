// FILE: src/pages/TasksPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchTasks, createTask, deleteTask } from "../api/taskApi";
import {
  Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, Alert, Chip, Paper, Grid, IconButton, Tooltip
} from "@mui/material";
import { Edit, Delete, AddCircle, TaskAlt, FilterList, Refresh } from "@mui/icons-material";
import axios from "axios";

const STATUS_COLORS = {
  "todo": "default",
  "in_progress": "info", 
  "done": "success"
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", project_id: "", assignee_id: "",
    status: "todo", due_date: ""
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("created");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  // Load tasks, users, and projects with demo data
  useEffect(() => {
    if (!user) return;
    
    // Add demo data immediately for testing
    setTasks([
      {
        id: 1,
        title: "Design Dashboard UI",
        description: "Create wireframes and mockups for the admin dashboard",
        project_id: 1,
        assignee_id: 2,
        status: "in_progress",
        due_date: "2025-11-02"
      },
      {
        id: 2,
        title: "Setup Database Schema",
        description: "Create tables for users, projects, and tasks",
        project_id: 1,
        assignee_id: 3,
        status: "done",
        due_date: "2025-10-28"
      },
      {
        id: 3,
        title: "Write API Documentation",
        description: "Document all REST endpoints with examples",
        project_id: 2,
        assignee_id: 2,
        status: "todo",
        due_date: "2025-11-05"
      },
      {
        id: 4,
        title: "Implement Authentication",
        description: "Add JWT-based authentication system",
        project_id: 1,
        assignee_id: 4,
        status: "in_progress",
        due_date: "2025-11-01"
      },
      {
        id: 5,
        title: "User Testing",
        description: "Conduct usability tests with beta users",
        project_id: 2,
        assignee_id: 3,
        status: "todo",
        due_date: "2025-11-10"
      }
    ]);

    setUsers([
      { id: 1, username: "admin", email: "admin@company.com" },
      { id: 2, username: "alice_dev", email: "alice@company.com" },
      { id: 3, username: "bob_designer", email: "bob@company.com" },
      { id: 4, username: "charlie_backend", email: "charlie@company.com" }
    ]);

    setProjects([
      { id: 1, name: "Project Management Tool" },
      { id: 2, name: "Mobile App Development" },
      { id: 3, name: "Website Redesign" }
    ]);

    // Also try to load real data (will override demo data if successful)
    async function loadRealData() {
      try {
        const [taskRes, userRes, projectRes] = await Promise.all([
          fetchTasks(user.token),
          axios.get("http://localhost:8000/users/", { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get("http://localhost:8000/projects/", { headers: { Authorization: `Bearer ${user.token}` } })
        ]);
        // Only override if we get real data
        if (taskRes.data.length > 0) setTasks(taskRes.data);
        if (userRes.data.length > 0) setUsers(userRes.data);
        if (projectRes.data.length > 0) setProjects(projectRes.data);
      } catch (err) {
        console.log("Using demo data - real API not available");
      }
    }
    loadRealData();
  }, [user]);

  // Handlers
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        project_id: Number(form.project_id),
        assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
        due_date: form.due_date || null
      };
      
      // Try real API first
      try {
        const res = await createTask(payload, user.token);
        setTasks(ts => [...ts, res.data]);
      } catch {
        // Fallback: add to demo data
        const newTask = {
          id: Math.max(...tasks.map(t => t.id)) + 1,
          ...payload,
          assignee_id: payload.assignee_id || null
        };
        setTasks(ts => [...ts, newTask]);
      }
      
      setOpen(false);
      setForm({ title: "", description: "", project_id: "", assignee_id: "", status: "todo", due_date: "" });
    } catch {
      setError("Could not create task");
    }
  }

  async function handleDelete(id) {
    try {
      // Try real API first
      try {
        await deleteTask(id, user.token);
      } catch {
        // Fallback: remove from demo data
        console.log("Removing from demo data");
      }
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  }

  // Sorting and Filtering
  const sortedTasks = tasks
    .filter(t => (statusFilter ? t.status === statusFilter : true))
    .sort((a, b) => {
      if (sort === "due") return (a.due_date || "").localeCompare(b.due_date || "");
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.id - a.id; // default: latest first
    });

  // Get user name helper
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : `Project ${projectId}`;
  };

  // Render
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <TaskAlt sx={{ verticalAlign: "middle", color: "success.main", mr: 1 }} />
          Task Management
        </Typography>
        <Tooltip title="Create New Task">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => setOpen(true)}
            sx={{ px: 3 }}
          >
            Create Task
          </Button>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value=""><em>All Status</em></MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              value={sort}
              onChange={e => setSort(e.target.value)}
              fullWidth
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="created">Sort: Newest</MenuItem>
              <MenuItem value="due">Sort: Due Date</MenuItem>
              <MenuItem value="title">Sort: Title</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ bgcolor: "white" }}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              Total: {sortedTasks.length} tasks
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Task Cards */}
      <Grid container spacing={3}>
        {sortedTasks.map(t => (
          <Grid item key={t.id} xs={12} sm={6} lg={4}>
            <Paper 
              elevation={4} 
              sx={{
                p: 3, 
                borderLeft: `6px solid ${
                  t.status === "done" ? "#43a047" : 
                  t.status === "in_progress" ? "#1e88e5" : "#ffa726"
                }`,
                bgcolor: t.status === "done" ? "#f0fff4" : 
                        t.status === "in_progress" ? "#e3f2fd" : "#fffde7",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}
            >
              {/* Task Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {t.title}
                </Typography>
                <Chip
                  label={t.status.replace("_", " ").toUpperCase()}
                  color={STATUS_COLORS[t.status] || "default"}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Task Description */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                {t.description}
              </Typography>

              {/* Task Details */}
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" mb={2}>
                <Chip 
                  label={`📁 ${getProjectName(t.project_id)}`} 
                  color="primary" 
                  size="small" 
                  variant="outlined" 
                />
                {t.due_date && (
                  <Chip 
                    label={`📅 Due: ${t.due_date}`} 
                    color="warning" 
                    size="small" 
                    variant="outlined" 
                  />
                )}
                {t.assignee_id && (
                  <Chip
                    label={`👤 ${getUserName(t.assignee_id)}`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Actions */}
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Create Task Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Create New Task
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  required 
                  label="Task Title" 
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  margin="dense" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Description" 
                  multiline
                  rows={3}
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  margin="dense" 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Select
                  fullWidth 
                  required 
                  displayEmpty
                  value={form.project_id}
                  onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value=""><em>Select Project</em></MenuItem>
                  {projects.map(p => <MenuItem key={p.id} value={String(p.id)}>{p.name}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Select
                  fullWidth 
                  displayEmpty
                  value={form.assignee_id}
                  onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value=""><em>No Assignment</em></MenuItem>
                  {users.map(u => <MenuItem key={u.id} value={String(u.id)}>{u.username}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Select 
                  fullWidth 
                  value={form.status} 
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))} 
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  type="date" 
                  label="Due Date" 
                  InputLabelProps={{ shrink: true }} 
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} 
                  margin="dense" 
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Create Task</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Error Alert */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <Alert severity="info" sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">No tasks found</Typography>
          <Typography variant="body2">Click <strong>Create Task</strong> to add your first task</Typography>
        </Alert>
      )}
    </Box>
  );
}
