import React, { useState, useEffect } from "react";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button, Avatar,
  LinearProgress, Chip, Paper, Divider, IconButton, Tooltip
} from "@mui/material";
import {
  Dashboard as DashboardIcon, Assignment, CheckCircle, Warning,
  TrendingUp, AddCircle, Settings, Refresh
} from "@mui/icons-material";
import { fetchTasks } from "../api/taskApi";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get user info
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userInfo);

      // Fetch tasks
      const tasksRes = await fetchTasks(token);
      const tasks = tasksRes.data || [];

      // Fetch projects
      const projectsRes = await axios.get("http://localhost:8000/projects/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projects = projectsRes.data || [];

      // Calculate stats
      const completedTasks = tasks.filter(t => t.status === "completed").length;
      const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
      const pendingTasks = tasks.filter(t => t.status === "pending").length;

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        pendingTasks,
      });

      setRecentTasks(tasks.slice(0, 5));
      setProjects(projects);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "success",
      "in-progress": "info",
      pending: "warning",
      blocked: "error"
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <CheckCircle sx={{ fontSize: 16 }} />,
      "in-progress": <TrendingUp sx={{ fontSize: 16 }} />,
      pending: <Warning sx={{ fontSize: 16 }} />,
      blocked: <Warning sx={{ fontSize: 16 }} />
    };
    return icons[status] || null;
  };

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6">Loading dashboard...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 8 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardIcon sx={{ fontSize: 36, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome back, {user?.username || "User"}!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role?.toUpperCase()} • Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={loadDashboardData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {/* Total Projects */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Total Projects
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalProjects}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                  {stats.totalProjects}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalTasks}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main", width: 50, height: 50 }}>
                  {stats.totalTasks}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {stats.completedTasks}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 50, height: 50 }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* In Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="info.main">
                    {stats.inProgressTasks}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main", width: 50, height: 50 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Completion Rate */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6" fontWeight="bold">
                Overall Completion Rate
              </Typography>
              <Chip label={`${completionRate}%`} color="primary" size="small" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {stats.completedTasks} out of {stats.totalTasks} tasks completed
          </Typography>
        </CardContent>
      </Card>

      {/* Recent Tasks & Projects */}
      <Grid container spacing={3}>
        {/* Recent Tasks */}
        <Grid item xs={12} md={7}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Recent Tasks
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentTasks.length > 0 ? (
                <Box>
                  {recentTasks.map((task, idx) => (
                    <Paper
                      key={task.id}
                      sx={{
                        p: 2,
                        mb: idx < recentTasks.length - 1 ? 1 : 0,
                        bgcolor: "background.default",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": { bgcolor: "action.hover", boxShadow: 2 }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {task.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {task.description?.substring(0, 50)}...
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" py={3}>
                  No tasks yet. Create one to get started!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Projects */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Active Projects
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {projects.length > 0 ? (
                <Box>
                  {projects.slice(0, 5).map((proj, idx) => (
                    <Paper
                      key={proj.id}
                      sx={{
                        p: 2,
                        mb: idx < Math.min(5, projects.length) - 1 ? 1 : 0,
                        bgcolor: "background.default",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": { bgcolor: "action.hover", boxShadow: 2 }
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {proj.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {proj.description?.substring(0, 40)}...
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" py={3}>
                  No projects yet. Create one now!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mt={4} display="flex" gap={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<AddCircle />}
          href="/projects"
        >
          Create Project
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Assignment />}
          href="/tasks"
        >
          View All Tasks
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Settings />}
          href="/profile"
        >
          Profile
        </Button>
      </Box>
    </Container>
  );
}