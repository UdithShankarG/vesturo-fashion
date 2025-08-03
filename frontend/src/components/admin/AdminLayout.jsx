import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Category,
  Article,
  Add,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/udishrav/U-admin");
    handleProfileMenuClose();
  };

  const menuItems = [
    {
      text: "Create Category",
      icon: <Category />,
      path: "/udishrav/U-admin/dashboard",
      active:
        location.pathname === "/udishrav/U-admin/dashboard" ||
        location.pathname === "/udishrav/U-admin/dashboard/create-category",
    },
    {
      text: "Create Post",
      icon: <Add />,
      path: "/udishrav/U-admin/dashboard/create-post",
      active: location.pathname === "/udishrav/U-admin/dashboard/create-post",
    },
    {
      text: "All Posts",
      icon: <Article />,
      path: "/udishrav/U-admin/dashboard/all-posts",
      active: location.pathname === "/udishrav/U-admin/dashboard/all-posts",
    },
  ];

  const drawer = (
    <Box
      sx={{ height: "100%", background: "transparent", position: "relative" }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)",
        }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: "0 8px 24px rgba(108, 92, 231, 0.3)",
          }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: '"Poppins", sans-serif',
            }}>
            V
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            fontFamily: '"Poppins", sans-serif',
          }}>
          VESTURO
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            display: "block",
            mt: 0.5,
            fontFamily: '"Poppins", sans-serif',
            fontSize: "12px",
          }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "16px",
                py: 2,
                px: 2.5,
                background: item.active
                  ? "linear-gradient(135deg, rgba(108, 92, 231, 0.15) 0%, rgba(90, 79, 207, 0.1) 100%)"
                  : "transparent",
                border: item.active
                  ? "1px solid rgba(108, 92, 231, 0.3)"
                  : "1px solid transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: item.active
                    ? "linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(90, 79, 207, 0.15) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  transform: "translateX(4px)",
                },
              }}>
              <ListItemIcon
                sx={{
                  color: item.active ? "#6C5CE7" : "rgba(255, 255, 255, 0.7)",
                  minWidth: "40px",
                  transition: "color 0.3s ease",
                }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "15px",
                    fontWeight: item.active ? 600 : 500,
                    color: item.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                    fontFamily: '"Poppins", sans-serif',
                    transition: "all 0.3s ease",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "16px",
            py: 2,
            px: 2.5,
            border: "1px solid rgba(255, 107, 107, 0.2)",
            background: "rgba(255, 107, 107, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "rgba(255, 107, 107, 0.1)",
              borderColor: "rgba(255, 107, 107, 0.3)",
              transform: "translateX(4px)",
            },
          }}>
          <ListItemIcon sx={{ color: "#FF6B6B", minWidth: "40px" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "15px",
                color: "#FF6B6B",
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* Subtle Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(108, 92, 231, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.01) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}>
        <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: "none" },
              color: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.05)",
              },
            }}>
            <MenuIcon />
          </IconButton>

          {/* Page Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: "#FFFFFF",
              fontWeight: 700,
              fontFamily: '"Poppins", sans-serif',
              fontSize: { xs: "18px", md: "20px" },
            }}>
            {menuItems.find((item) => item.active)?.text || "Dashboard"}
          </Typography>

          {/* Profile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                display: { xs: "none", sm: "block" },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
              }}>
              Welcome, {admin?.name || "Admin"}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{
                color: "inherit",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.05)",
                },
              }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background:
                    "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: '"Poppins", sans-serif',
                  boxShadow: "0 4px 12px rgba(108, 92, 231, 0.3)",
                }}>
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          "& .MuiPaper-root": {
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            mt: 1,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          },
        }}>
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.05)",
              color: "#FFFFFF",
            },
          }}>
          <ListItemIcon>
            <AccountCircle sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.05)",
              color: "#FFFFFF",
            },
          }}>
          <ListItemIcon>
            <Settings sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "#FF6B6B",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 107, 107, 0.1)",
              color: "#FF5252",
            },
          }}>
          <ListItemIcon>
            <Logout sx={{ color: "#FF6B6B" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(20px)",
              border: "none",
            },
          }}>
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(20px)",
              border: "none",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          background: "transparent",
          minHeight: "100vh",
          position: "relative",
        }}>
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
