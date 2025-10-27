import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { loginUser } from "../api/userApi";
import { useAuth } from "../context/AuthProvider";
import {
  Container, Card, CardContent, Typography,
  TextField, Button, CardActions, Box, Alert, Link
} from "@mui/material";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser(form);
      // Debug: See what you actually receive
      console.log("Login response:", response.data);
      const { access_token, username, role } = response.data;

      if (!access_token) throw new Error("No token returned!");

      localStorage.setItem("token", access_token); // For direct usage
      login({ username, role, token: access_token }); // Update context

      navigate("/dashboard");
    } catch (err) {
  let msg = "Login failed. Please check your credentials.";
  const data = err?.response?.data;
  if (typeof data === "string") {
    msg = data;
  } else if (Array.isArray(data?.detail)) {
    // FastAPI validation errors
    msg = data.detail.map(e => e.msg).join(" | ");
  } else if (data?.detail) {
    msg = data.detail;
  } else if (data?.msg) {
    msg = data.msg;
  } else if (data) {
    msg = JSON.stringify(data);
  } else if (err?.message) {
    msg = err.message;
  }
  setError(msg);
}
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              name="email"
              fullWidth
              label="Email"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              name="password"
              fullWidth
              label="Password"
              required
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
            />
            
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            <CardActions sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" fullWidth>Login</Button>
            </CardActions>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/signup">
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
