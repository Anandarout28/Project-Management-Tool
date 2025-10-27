import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchTasks, createTask, deleteTask } from "../api/taskApi";
import {
  Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Select, MenuItem, Alert
} from "@mui/material";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", project_id: "", assignee_id: "", status: "todo", due_date: "" });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function loadTasks() {
      try {
        const res = await fetchTasks(user.token);
        setTasks(res.data);
      } catch {
        setError("Could not fetch tasks");
      }
    }
    loadTasks();
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await createTask(form, user.token);
      setTasks(ts => [...ts, res.data]);
      setOpen(false);
      setForm({ title: "", description: "", project_id: "", assignee_id: "", status: "todo", due_date: "" });
    } catch {
      setError("Could not create task");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id, user.token);
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Create Task</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField fullWidth required label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} margin="dense" />
            <TextField fullWidth label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} margin="dense" />
            <TextField fullWidth required label="Project ID" value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))} margin="dense" />
            <TextField fullWidth label="Assignee ID" value={form.assignee_id} onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))} margin="dense" />
            <Select fullWidth label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} margin="dense">
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} margin="dense" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
      {error && <Alert severity="error">{error}</Alert>}
      <List sx={{ mt: 2 }}>
        {tasks.map(t => (
          <ListItem key={t.id} divider secondaryAction={
            <Button color="error" variant="outlined" size="small" onClick={() => handleDelete(t.id)}>Delete</Button>
          }>
            <ListItemText
              primary={<Typography variant="h6">{t.title}</Typography>}
              secondary={`Status: ${t.status} | Due: ${t.due_date} | ${t.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
