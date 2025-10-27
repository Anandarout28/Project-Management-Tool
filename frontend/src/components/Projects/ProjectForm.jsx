import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { createProject } from "../../api/projectApi";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectForm({ open, handleClose }) {
  const [form, setForm] = useState({ 
  name: "", 
  description: "",
  start_date: "",
  end_date: ""
});
  const { fetchProjects } = useProjects();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject(form, localStorage.getItem("token"));
    fetchProjects();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Project Name"
          fullWidth
          required
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <TextField
         margin="dense"
  type="date"
  label="Start Date"
   halfWidth
    
  value={form.start_date}
  onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
  InputLabelProps={{ shrink: true }}
/>
<TextField
 margin="dense"
  type="date"
  label="End Date"
   halfWidth
      
  value={form.end_date}
  onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
  InputLabelProps={{ shrink: true }}
/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
