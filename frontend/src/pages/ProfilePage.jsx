// FILE: src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Card, CardContent, Typography, Avatar, Box, Grid, Chip, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider, LinearProgress, IconButton, Tooltip
} from "@mui/material";
import { AccountCircle, Email, Work, Settings, BarChart, People, Checklist, Shield, Logout, Dashboard, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile
    axios.get("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
      setForm({ username: res.data.username, email: res.data.email });
    }).catch(err => console.error("Error fetching profile:", err));

    // Fetch stats based on role
    axios.get("http://localhost:8000/stats", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data))
      .catch(() => setStats({}));
  }, [token]);

  const handleUpdate = () => {
    axios.put("http://localhost:8000/users/me", form, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
      setEditOpen(false);
      alert("Profile updated successfully!");
    }).catch(err => alert("Failed to update profile"));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "error",
      manager: "warning",
      developer: "info",
      user: "success"
    };
    return colors[role] || "default";
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: <Shield />,
      manager: <People />,
      developer: <Checklist />,
      user: <AccountCircle />
    };
    return icons[role] || <AccountCircle />;
  };

  // Reusable Action Button Bar
  const renderActionButtons = () => (
    <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 3, flexWrap: "wrap" }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Dashboard />}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<Settings />}
        onClick={() => navigate("/projects")}
      >
        Projects
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<Logout />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );

  // Reusable Edit Dialog
  const renderEditDialog = () => (
    <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Your Profile</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          fullWidth
          margin="normal"
          variant="outlined"
          type="email"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setEditOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );

  if (!user) return <Typography align="center" sx={{ mt: 4 }}>Loading...</Typography>;

  // ADMIN PROFILE
  if (user.role === "admin") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
          <Tooltip title="Logout"><IconButton color="error" onClick={handleLogout}><Logout /></IconButton></Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Main Profile Card */}
          <Grid item xs={12} md={4}>
           <Card elevation={4} sx={{ background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)" }}>

              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar sx={{ width: 100, height: 100, bgcolor: "white", mb: 2, color: "error.main" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role.toUpperCase()}
                    color={getRoleBadgeColor(user.role)}
                    sx={{ mt: 1, fontWeight: "bold" }}
                  />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 2 }}>
                    {user.email}
                  </Typography>
                  {renderActionButtons()}
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Edit />}
                    size="small"
                    sx={{ mt: 3, width: "100%" }}
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Admin Stats */}
          <Grid item xs={12} md={8}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" mb={2} fontWeight="bold">
                  <BarChart sx={{ mr: 1, verticalAlign: "middle" }} />
                  System Overview
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "error.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "error.main", fontWeight: "bold" }}>{stats.total_users || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Total Users</Typography>
                      <LinearProgress variant="determinate" value={Math.min((stats.total_users || 0) * 10, 100)} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "primary.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "primary.main", fontWeight: "bold" }}>{stats.total_projects || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Projects</Typography>
                      <LinearProgress variant="determinate" value={Math.min((stats.total_projects || 0) * 10, 100)} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "success.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "success.main", fontWeight: "bold" }}>{stats.total_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Tasks</Typography>
                      <LinearProgress variant="determinate" value={Math.min((stats.total_tasks || 0) * 10, 100)} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "info.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "info.main", fontWeight: "bold" }}>{stats.active_users || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Active</Typography>
                      <LinearProgress variant="determinate" value={Math.min((stats.active_users || 0) * 10, 100)} sx={{ mt: 1 }} />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Admin Settings */}
          <Grid item xs={12}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" mb={2} fontWeight="bold">
                  <Settings sx={{ mr: 1, verticalAlign: "middle" }} />
                  Admin Controls
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" color="error">View All Users</Button>
                  <Button variant="contained" color="warning">System Settings</Button>
                  <Button variant="contained" color="info">View Logs</Button>
                  <Button variant="outlined">Manage Roles</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {renderEditDialog()}
      </Container>
    );
  }

  // MANAGER PROFILE
  if (user.role === "manager") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Manager Profile</Typography>
          <Tooltip title="Logout"><IconButton color="error" onClick={handleLogout}><Logout /></IconButton></Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card elevation={4} sx={{ background: "linear-gradient(135deg, #ffa500 0%, #ffb84d 100%)" }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar sx={{ width: 100, height: 100, bgcolor: "white", mb: 2, color: "warning.main" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
                  <Chip label="MANAGER" color="warning" sx={{ mt: 1, fontWeight: "bold" }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 2 }}>
                    {user.email}
                  </Typography>
                  {renderActionButtons()}
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Edit />}
                    size="small"
                    sx={{ mt: 3, width: "100%" }}
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={9}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" mb={2} fontWeight="bold"><People sx={{ mr: 1, verticalAlign: "middle" }} />Team Performance</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "warning.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "warning.main", fontWeight: "bold" }}>{stats.team_size || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Team Members</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "info.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "info.main", fontWeight: "bold" }}>{stats.assigned_projects || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Projects Managed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "success.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "success.main", fontWeight: "bold" }}>{stats.team_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Team Tasks</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" color="warning">View Team</Button>
                  <Button variant="contained" color="info">Manage Assignments</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {renderEditDialog()}
      </Container>
    );
  }

  // DEVELOPER PROFILE
  if (user.role === "developer") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Developer Profile</Typography>
          <Tooltip title="Logout"><IconButton color="error" onClick={handleLogout}><Logout /></IconButton></Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={4} sx={{ background: "linear-gradient(135deg, #1e90ff 0%, #4169e1 100%)" }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar sx={{ width: 100, height: 100, bgcolor: "white", mb: 2, color: "info.main" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
                  <Chip label="DEVELOPER" color="info" sx={{ mt: 1, fontWeight: "bold" }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 2 }}>
                    {user.email}
                  </Typography>
                  {renderActionButtons()}
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Edit />}
                    size="small"
                    sx={{ mt: 3, width: "100%" }}
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" mb={2} fontWeight="bold"><Checklist sx={{ mr: 1, verticalAlign: "middle" }} />My Tasks & Assignments</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "info.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "info.main", fontWeight: "bold" }}>{stats.assigned_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Assigned</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "success.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "success.main", fontWeight: "bold" }}>{stats.completed_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Completed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "warning.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "warning.main", fontWeight: "bold" }}>{stats.in_progress_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>In Progress</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: "error.lighter", borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ color: "error.main", fontWeight: "bold" }}>{stats.pending_tasks || 0}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Pending</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {renderEditDialog()}
      </Container>
    );
  }

  // USER PROFILE (Default)
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">My Profile</Typography>
        <Tooltip title="Logout"><IconButton color="error" onClick={handleLogout}><Logout /></IconButton></Tooltip>
      </Box>

      <Card elevation={4} sx={{ background: "linear-gradient(135deg, #52c41a 0%, #85ce61 100%)" }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 100, height: 100, bgcolor: "white", mb: 2, color: "success.main" }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
            <Chip label="USER" color="success" sx={{ mt: 1, fontWeight: "bold" }} />
            <Divider sx={{ my: 3, width: "100%", bgcolor: "rgba(255,255,255,0.3)" }} />
            <Box width="100%">
              <Box display="flex" alignItems="center" gap={1} mb={2} sx={{ color: "white" }}>
                <Email />
                <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ color: "white" }}>
                <Work />
                <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>
              </Box>
            </Box>
            {renderActionButtons()}
            <Button
              variant="contained"
              color="warning"
              startIcon={<Edit />}
              sx={{ mt: 3, width: "100%" }}
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {renderEditDialog()}
    </Container>
  );
}
