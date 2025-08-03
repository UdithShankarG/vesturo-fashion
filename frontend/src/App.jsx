import { useEffect, lazy, Suspense, memo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress, Typography } from "@mui/material";
import theme from "./theme/theme";
import useAuthStore from "./store/authStore";

// Lazy load components for better performance
const HomePage = lazy(() => import("./components/home/HomePage"));
const ViewMorePage = lazy(() => import("./pages/public/ViewMorePage.jsx"));
const PostDetailsPage = lazy(() =>
  import("./pages/public/PostDetailsPage.jsx")
);

// Admin Pages - Lazy loaded
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ForgotPassword = lazy(() => import("./pages/admin/ForgotPassword"));
const SetNewPassword = lazy(() => import("./pages/admin/SetNewPassword"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const CategoryCreation = lazy(() => import("./pages/admin/CategoryCreation"));
const PostCreation = lazy(() => import("./pages/admin/PostCreation"));
const AllPosts = lazy(() => import("./pages/admin/AllPosts"));

// Protected Route Component
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Enhanced Loading component with meaningful message
const LoadingSpinner = () => (
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
        Preparing Your Fashion Experience
      </Typography>
      <Typography
        sx={{
          color: "#CCCCCC",
          fontSize: "14px",
          opacity: 0.8,
        }}>
        Loading the latest trends just for you...
      </Typography>
    </Box>
  </Box>
);

const App = memo(() => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<ViewMorePage />} />
            <Route path="/post/:slug" element={<PostDetailsPage />} />

            {/* Admin Authentication Routes */}
            <Route path="/udishrav/U-admin" element={<AdminLogin />} />
            <Route
              path="/udishrav/U-admin/forgot"
              element={<ForgotPassword />}
            />
            <Route
              path="/udishrav/U-admin/reset"
              element={<SetNewPassword />}
            />

            {/* Protected Admin Routes */}
            <Route
              path="/udishrav/U-admin/dashboard"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </Suspense>
              }>
              <Route index element={<CategoryCreation />} />
              <Route path="create-category" element={<CategoryCreation />} />
              <Route path="create-post" element={<PostCreation />} />
              <Route path="all-posts" element={<AllPosts />} />
              <Route path="posts/edit/:id" element={<PostCreation />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
});

export default App;
