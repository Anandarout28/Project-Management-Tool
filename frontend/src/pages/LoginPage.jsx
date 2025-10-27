import React, { useState } from "react";
import { loginUser } from "../api/userApi";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, TextField, Button, CardActions, Box, Alert, Link
} from "@mui/material";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(form);
      login({ token: res.data.access_token, role: "unknown" });
      navigate("/dashboard");
    } catch {
      setError("Login failed. Check credentials.");
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Email" required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} margin="normal" />
            <TextField fullWidth label="Password" required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} margin="normal" />
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            <CardActions sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" fullWidth>Login</Button>
            </CardActions>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/signup">Don't have an account? Sign up</Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
