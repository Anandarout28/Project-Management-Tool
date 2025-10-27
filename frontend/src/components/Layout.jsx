import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, IconButton, Avatar, Menu, MenuItem,
  Tooltip, Badge
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../context/AuthProvider";

const drawerWidth = 260;

const navItems = [
  { text: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
  { text: "Projects", to: "/projects", icon: <AssignmentTurnedInIcon /> },
  { text: "Tasks", to: "/task", icon: <ListIcon /> },
  { text: "Users", to: "/users", icon: <PeopleOutlineIcon />, roles: ["admin"] },
  { text: "Profile", to: "/profile", icon: <AccountCircleIcon /> }
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const drawerContent = (
    <>
      {/* Sidebar Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 2,
          color: "#fff",
          textAlign: "center",
          borderBottom: "2px solid rgba(255,255,255,0.1)"
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            margin: "0 auto 10px",
            bgcolor: "#fff",
            color: "#667eea",
            fontWeight: "bold",
            fontSize: 24
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "0.5px" }}>
          {user?.username || "User"}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {user?.role?.toUpperCase()}
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ pt: 2 }}>
        {navItems
          .filter(item => !item.roles || item.roles.includes(user?.role))
          .map(item => (
            <Tooltip key={item.text} title={item.text} placement="right">
              <ListItemButton
                selected={location.pathname.startsWith(item.to)}
                onClick={() => {
                  navigate(item.to);
                  setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    "& .MuiListItemIcon-root": { color: "#fff" }
                  },
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.08)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { fontWeight: 500, fontSize: "14px" }
                  }}
                />
              </ListItemButton>
            </Tooltip>
          ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Sidebar Footer */}
      <Box sx={{ p: 2, textAlign: "center", mt: "auto" }}>
        <Typography variant="caption" color="textSecondary">
          © 2025 Project Management Tool
        </Typography>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Enhanced AppBar */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "3px solid #764ba2",
          boxShadow: "0 4px 20px 0 rgba(102, 126, 234, 0.15)"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 1, md: 3 } }}>
          {/* Left Side - Logo & Title */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: "bold",
                letterSpacing: "1px",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                background: "linear-gradient(135deg, #fff 0%, #e8eaf6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              PMT
            </Typography>
          </Box>

          {/* Right Side - Notifications & Profile Menu */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenu}
                sx={{
                  ml: 1,
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#fff",
                    color: "#667eea",
                    fontWeight: "bold"
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }
              }}
            >
              <MenuItem disabled sx={{ cursor: "default", pb: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {user?.username}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate("/settings"); handleMenuClose(); }}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Accent Bar */}
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(90deg, #764ba2 0%, #f093fb 100%)",
            borderRadius: 20
          }}
        />
      </AppBar>

      {/* Sidebar - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#fff",
            border: "none",
            boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column"
          }
        }}
        open
      >
        <Toolbar /> {/* Spacing for AppBar */}
        {drawerContent}
      </Drawer>

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          ml: { xs: 0, sm: `${drawerWidth}px` },
          transition: "all 0.3s ease",
          minHeight: "100vh",
          bgcolor: "#f5f7fa"
        }}
      >
        <Toolbar /> {/* Spacing for AppBar */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            border: "2px solid #e0e7ff",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.08)",
            p: { xs: 2, md: 4 },
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.12)",
              borderColor: "#667eea"
            }
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
