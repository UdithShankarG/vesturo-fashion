import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}>
        <CircularProgress
          size={50}
          sx={{
            color: "#6C5CE7",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.6 },
              "100%": { opacity: 1 },
            },
            animation: "pulse 2s infinite",
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: 600,
              mb: 1,
            }}>
            Verifying Access
          </Typography>
          <Typography
            sx={{
              color: "#CCCCCC",
              fontSize: "14px",
              opacity: 0.8,
            }}>
            Checking your admin credentials...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return (
      <Navigate to="/udishrav/U-admin" state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
