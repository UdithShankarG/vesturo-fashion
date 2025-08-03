import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Instagram, Favorite } from "@mui/icons-material";
import usePostStats from "../../hooks/usePostStats";

const SupportSection = ({ onInstagramClick }) => {
  const { totalPosts, loading, error } = usePostStats();
  return (
    <Box
      sx={{
        position: "relative",
        mt: { xs: "120px", md: "150px" },
        px: { xs: "24px", md: "48px" },
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}>
      {/* Modern Container with Glass Effect */}
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          p: { xs: "40px 24px", md: "60px 48px" },
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Subtle Background Gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 0%, rgba(108, 92, 231, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            mb: { xs: "24px", md: "32px" },
            position: "relative",
            zIndex: 1,
          }}>
          <Favorite
            sx={{
              fontSize: { xs: "32px", md: "40px" },
              color: "#6C5CE7",
              filter: "drop-shadow(0 4px 12px rgba(108, 92, 231, 0.3))",
            }}
          />
        </Box>

        {/* Heading */}
        <Typography
          sx={{
            fontSize: { xs: "28px", md: "36px" },
            fontWeight: 700,
            color: "#FFFFFF",
            mb: { xs: "16px", md: "24px" },
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "0.02em",
            position: "relative",
            zIndex: 1,
          }}>
          Support Our Vision
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.6,
            mb: { xs: "32px", md: "40px" },
            maxWidth: "600px",
            mx: "auto",
            fontFamily: '"Poppins", sans-serif',
            position: "relative",
            zIndex: 1,
          }}>
          Join our community and help us inspire fashion lovers worldwide. Every
          follow brings us closer to building the ultimate style destination.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "16px", sm: "20px" },
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}>
          {/* Primary Follow Button */}
          <Button
            variant="contained"
            onClick={onInstagramClick}
            sx={{
              bgcolor: "#6C5CE7",
              color: "#FFFFFF",
              px: { xs: "32px", md: "40px" },
              py: { xs: "12px", md: "14px" },
              borderRadius: "16px",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 600,
              textTransform: "none",
              fontFamily: '"Poppins", sans-serif',
              boxShadow: "0 8px 24px rgba(108, 92, 231, 0.4)",
              "&:hover": {
                bgcolor: "#5A4FCF",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(108, 92, 231, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            Follow VESTURO
          </Button>

          {/* Instagram Icon Button */}
          <IconButton
            href="https://instagram.com/_vesturo"
            target="_blank"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              width: { xs: "48px", md: "52px" },
              height: { xs: "48px", md: "52px" },
              borderRadius: "16px",
              "&:hover": {
                color: "#E1306C",
                backgroundColor: "rgba(225, 48, 108, 0.1)",
                borderColor: "rgba(225, 48, 108, 0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            <Instagram sx={{ fontSize: { xs: "20px", md: "24px" } }} />
          </IconButton>
        </Box>

        {/* Support Stats */}
        <Box
          sx={{
            mt: { xs: "40px", md: "48px" },
            pt: { xs: "32px", md: "40px" },
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}>
          {/* Posts Count as Outfits */}
          <Box sx={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "#6C5CE7",
                  mb: "4px",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 700,
                  color: "#6C5CE7",
                  fontFamily: '"Poppins", sans-serif',
                  mb: "4px",
                }}>
                {totalPosts.formatted}
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Poppins", sans-serif',
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
              Outfits
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportSection;
