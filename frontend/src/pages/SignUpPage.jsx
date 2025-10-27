import React, { useState } from "react";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, TextField, Button, MenuItem, CardActions, Box, Alert
} from "@mui/material";

export default function SignUpPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await registerUser(form);
      setSuccess("Registration successful! Please login.");
      setForm({ username: "", email: "", password: "", role: "" });
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("Registration failed.");
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Username" required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} margin="normal" />
            <TextField fullWidth type="email" label="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} margin="normal" />
            <TextField fullWidth type="password" label="Password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} margin="normal" />
            <TextField
              fullWidth label="Role" select required value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              margin="normal"
            >
              <MenuItem value="admin">Admin</MenuItem>
<MenuItem value="manager">Manager</MenuItem>
<MenuItem value="developer">Developer</MenuItem>
<MenuItem value="user">User</MenuItem>

            </TextField>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
            <CardActions sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" fullWidth>Register</Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
