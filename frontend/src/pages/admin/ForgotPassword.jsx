import { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    dateOfBirth: "",
  });

  // Custom Alert System
  const showCustomAlert = (message, type = "error") => {
    const existingAlert = document.querySelector("#custom-alert");
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement("div");
    alert.id = "custom-alert";
    alert.style.cssText = `
      position: fixed; top: 24px; right: 24px; z-index: 10001;
      background: ${
        type === "error"
          ? "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)"
          : "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)"
      };
      color: white; padding: 20px 28px; border-radius: 20px;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 15px;
      box-shadow: 0 20px 60px ${
        type === "error"
          ? "rgba(255, 107, 107, 0.4)"
          : "rgba(108, 92, 231, 0.4)"
      }, 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; align-items: center; gap: 12px; user-select: none; max-width: 400px;
    `;

    alert.innerHTML = `
      <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">
        ${type === "error" ? "⚠️" : "✅"}
      </div>
      <span>${message}</span>
    `;

    if (!document.querySelector("#alert-styles")) {
      const style = document.createElement("style");
      style.id = "alert-styles";
      style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(100%) scale(0.8); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bgFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(alert);
    setTimeout(() => {
      alert.style.animation = "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => alert.parentNode?.removeChild(alert), 400);
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword(formData);
      if (result.success) {
        showCustomAlert(
          "Verification successful! Redirecting to reset password...",
          "success"
        );
        setTimeout(() => {
          navigate("/udishrav/U-admin/reset", {
            state: { adminId: result.adminId },
          });
        }, 2000);
      }
    } catch (error) {
      showCustomAlert(
        error.message || "Verification failed. Please check your details.",
        "error"
      );
    }
  };

  useEffect(() => {
    if (error) showCustomAlert(error, "error");
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 3 },
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
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
            radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(108, 92, 231, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)
          `,
          animation: "bgFloat 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm">
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            p: { xs: 4, md: 6 },
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            position: "relative",
            overflow: "hidden",
          }}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
            <Box
              sx={{
                width: { xs: 80, md: 96 },
                height: { xs: 80, md: 96 },
                background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto",
                boxShadow: "0 12px 40px rgba(108, 92, 231, 0.3)",
              }}>
              <Typography
                sx={{
                  fontSize: { xs: "32px", md: "40px" },
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: '"Poppins", sans-serif',
                }}>
                🔑
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "28px", md: "32px" },
                fontWeight: 700,
                color: "#FFFFFF",
                mb: 1,
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: "-0.02em",
              }}>
              Reset Password
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
              }}>
              Enter your details to verify your identity
            </Typography>
          </Box>

          {/* Modern Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 1.5,
                  fontFamily: '"Poppins", sans-serif',
                }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your registered email"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "16px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.06)",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused": {
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "#6C5CE7",
                      boxShadow: "0 0 0 3px rgba(108, 92, 231, 0.1)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "16px 20px",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.4)",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Date of Birth Field */}
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 1.5,
                  fontFamily: '"Poppins", sans-serif',
                }}>
                Date of Birth
              </Typography>
              <TextField
                fullWidth
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "16px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.06)",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused": {
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "#6C5CE7",
                      boxShadow: "0 0 0 3px rgba(108, 92, 231, 0.1)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "16px 20px",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.4)",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Modern Reset Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                color: "#FFFFFF",
                py: { xs: 2, md: 2.5 },
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 700,
                fontFamily: '"Poppins", sans-serif',
                borderRadius: "20px",
                textTransform: "none",
                boxShadow: "0 12px 40px rgba(108, 92, 231, 0.3)",
                border: "1px solid rgba(108, 92, 231, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                mb: { xs: 3, md: 4 },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                  boxShadow: "0 16px 50px rgba(108, 92, 231, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "none",
                  transform: "none",
                },
              }}>
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid #FFFFFF",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Verifying...
                </Box>
              ) : (
                "Verify & Reset Password"
              )}
            </Button>

            {/* Back to Login Link */}
            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/udishrav/U-admin"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  textDecoration: "none",
                  fontSize: { xs: "14px", md: "15px" },
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: "#6C5CE7",
                    textDecoration: "none",
                  },
                }}>
                ← Back to Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
