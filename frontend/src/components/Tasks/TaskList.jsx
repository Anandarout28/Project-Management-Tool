// FILE: src/components/TaskList.jsx
import React, { useState, useEffect } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../../api/taskApi";
import axios from "axios";
import {
  Box, Typography, Button, Paper, Grid, Chip, MenuItem, Select, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [open, setOpen] = useState(false);
  // get token from localStorage or your auth provider/context
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks(token).then(res => setTasks(res.data));
    axios.get("http://localhost:8000/users/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data));
  }, [token]);

  const handleAssign = (taskId, userId) => {
    axios.post(`http://localhost:8000/tasks/${taskId}/assign`, { user_id: userId }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchTasks(token).then(res => setTasks(res.data)));
  };

  const handleDelete = id => {
    deleteTask(id, token).then(() =>
      setTasks(tasks => tasks.filter(t => t.id !== id))
    );
  };

  const handleOpenForm = task => {
    setEditTask(task || { title: "", description: "", status: "todo", assignee_id: "", due_date: "" });
    setOpen(true);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setEditTask(t => ({ ...t, [name]: value }));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const req = editTask.id
      ? updateTask(editTask.id, editTask, token)
      : createTask(editTask, token);
    req.then(() =>
      fetchTasks(token).then(res => { setTasks(res.data); setOpen(false); })
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" onClick={() => handleOpenForm()}>Create Task</Button>
      </Box>
      <Grid container spacing={2}>
        {tasks.map(task => (
          <Grid item xs={12} md={6} key={task.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{task.title}</Typography>
              <Typography>{task.description}</Typography>
              <Chip label={task.status} sx={{ mb: 1, mt: 1 }} color={task.status === "done" ? "success" : "default"} />
              <Box mt={1} display="flex" gap={1} alignItems="center">
                <Select
                  size="small"
                  value={task.assignee_id || ""}
                  displayEmpty
                  onChange={e => handleAssign(task.id, e.target.value)}
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value=""><em>Assign</em></MenuItem>
                  {users.map(u => (
                    <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
                  ))}
                </Select>
                <Button size="small" onClick={() => handleOpenForm(task)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(task.id)}>Delete</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Task Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editTask?.id ? "Edit Task" : "Create Task"}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ minWidth: 320 }}>
            <TextField
              label="Title"
              name="title"
              value={editTask?.title || ""}
              onChange={handleFormChange}
              fullWidth required
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={editTask?.description || ""}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
            />
            <TextField
              select
              label="Status"
              name="status"
              value={editTask?.status || "todo"}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            >
              {["todo", "in_progress", "done"].map(option => (
                <MenuItem value={option} key={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              name="due_date"
              type="date"
              value={editTask?.due_date || ""}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Select
              name="assignee_id"
              label="Assign User"
              value={editTask?.assignee_id || ""}
              onChange={handleFormChange}
              fullWidth
              displayEmpty
              margin="normal"
            >
              <MenuItem value=""><em>Assign user</em></MenuItem>
              {users.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTask?.id ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
