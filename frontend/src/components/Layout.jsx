import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Divider
} from "@mui/material";
import { Dashboard, Person, Work, Task, ExitToApp, SupervisorAccount } from "@mui/icons-material";

const DRAWER_WIDTH = 240;

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Dashboard />, roles: ["admin", "manager", "developer"] },
    { label: "Projects", path: "/projects", icon: <Work />, roles: ["admin", "manager", "developer"] },
    { label: "Tasks", path: "/tasks", icon: <Task />, roles: ["admin", "manager", "developer"] },
    { label: "Users", path: "/users", icon: <SupervisorAccount />, roles: ["admin"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role) || user?.role === "admin"
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Project Management Hub
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username} ({user?.role})
          </Typography>
          <Button color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {filteredItems.map(item => (
              <ListItem
                button
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
