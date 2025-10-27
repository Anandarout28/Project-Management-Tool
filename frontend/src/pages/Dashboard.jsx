import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api/projectApi";
import { fetchTasks } from "../api/taskApi";
import {
  Box, Grid, Paper, Typography, Button, Card, CardContent, CardActions, Chip
} from "@mui/material";
import { Add, TrendingUp, Assignment, People } from "@mui/icons-material";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completedTasks: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetchProjects(user.token),
          fetchTasks(user.token)
        ]);
        
        setRecentProjects(projectsRes.data.slice(0, 3));
        setRecentTasks(tasksRes.data.slice(0, 5));
        
        const completedCount = tasksRes.data.filter(t => t.status === "done").length;
        setStats({
          projects: projectsRes.data.length,
          tasks: tasksRes.data.length,
          completedTasks: completedCount
        });
      } catch (error) {
        console.error("Failed to load dashboard data");
      }
    }
    loadData();
  }, [user]);

  const quickActions = [
    { label: "Create Project", action: () => navigate("/projects"), roles: ["admin", "manager"], icon: <Add /> },
    { label: "View All Tasks", action: () => navigate("/tasks"), roles: ["admin", "manager", "developer"], icon: <Assignment /> },
    { label: "Manage Users", action: () => navigate("/users"), roles: ["admin"], icon: <People /> },
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(user?.role) || user?.role === "admin"
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Welcome, {user?.username}!</Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <TrendingUp sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
            <Box>
              <Typography variant="h4">{stats.projects}</Typography>
              <Typography color="textSecondary">Active Projects</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Assignment sx={{ fontSize: 40, mr: 2, color: "warning.main" }} />
            <Box>
              <Typography variant="h4">{stats.tasks}</Typography>
              <Typography color="textSecondary">Total Tasks</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <TrendingUp sx={{ fontSize: 40, mr: 2, color: "success.main" }} />
            <Box>
              <Typography variant="h4">{stats.completedTasks}</Typography>
              <Typography color="textSecondary">Completed Tasks</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>Quick Actions</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {filteredActions.map((action, index) => (
          <Grid item key={index}>
            <Button
              variant="outlined"
              startIcon={action.icon}
              onClick={action.action}
              sx={{ minWidth: 150 }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Recent Projects and Tasks */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Recent Projects</Typography>
          {recentProjects.map(project => (
            <Card key={project.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography color="textSecondary">{project.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
          {recentTasks.map(task => (
            <Card key={task.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Chip 
                  label={task.status.replace("_", " ")} 
                  color={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "default"}
                  size="small"
                />
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
