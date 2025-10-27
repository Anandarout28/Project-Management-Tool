import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchProjects, createProject } from "../api/projectApi";
import {
  Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Alert
} from "@mui/material";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", start_date: "", end_date: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      if (!user) return;
      try {
        const res = await fetchProjects(user.token);
        setProjects(res.data);
      } catch {
        setError("Could not fetch projects");
      }
    }
    loadProjects();
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await createProject(form, user.token);
      setProjects(ps => [...ps, res.data]);
      setOpen(false);
      setForm({ name: "", description: "", start_date: "", end_date: "" });
    } catch {
      setError("Could not create project");
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Projects</Typography>
      {user && (user.role === "admin" || user.role === "manager") && (
        <Button variant="contained" onClick={() => setOpen(true)}>Create Project</Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Project</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField fullWidth required label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} margin="dense" />
            <TextField fullWidth label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} margin="dense" />
            <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} margin="dense" />
            <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} margin="dense" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      {error && <Alert severity="error">{error}</Alert>}
      <List sx={{ mt: 2 }}>
        {projects.map(p => (
          <ListItem key={p.id} divider>
            <ListItemText
              primary={
                <Typography variant="h6">{p.name}</Typography>
              }
              secondary={`Duration: ${p.start_date} → ${p.end_date} | ${p.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
