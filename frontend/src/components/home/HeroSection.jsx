import { Box, Typography, Button, IconButton } from "@mui/material";
import { Instagram, ArrowDownward } from "@mui/icons-material";

const HeroSection = ({ onInstagramClick }) => {
  const scrollToContent = () => {
    const element = document.querySelector('[data-section="featured"]');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "85vh", md: "90vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: { xs: "24px", md: "48px" },
        py: { xs: "60px", md: "80px" },
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          right: "15%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(108, 92, 231, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          mx: "auto",
        }}>
        {/* Main Heading */}
        <Typography
          sx={{
            fontSize: { xs: "48px", sm: "64px", md: "80px", lg: "96px" },
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 0.9,
            mb: { xs: "24px", md: "32px" },
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "-0.02em",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
          }}>
          Dream
          <Box component="span" sx={{ display: "block", color: "#6C5CE7" }}>
            Wardrobe
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "24px" },
            fontWeight: 300,
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.4,
            mb: { xs: "40px", md: "48px" },
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "0.01em",
          }}>
          Discover curated styles that express your identity and inspire
          confidence
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "16px", sm: "24px" },
            justifyContent: "center",
            alignItems: "center",
            mb: { xs: "60px", md: "80px" },
          }}>
          {/* Primary CTA Button */}
          <Button
            variant="contained"
            onClick={onInstagramClick}
            sx={{
              bgcolor: "#6C5CE7",
              color: "#FFFFFF",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 600,
              px: { xs: "32px", md: "40px" },
              py: { xs: "14px", md: "16px" },
              borderRadius: "16px",
              textTransform: "none",
              fontFamily: '"Poppins", sans-serif',
              boxShadow: "0 8px 32px rgba(108, 92, 231, 0.4)",
              border: "1px solid rgba(108, 92, 231, 0.3)",
              backdropFilter: "blur(20px)",
              "&:hover": {
                bgcolor: "#5A4FCF",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(108, 92, 231, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            Explore Collection
          </Button>

          {/* Secondary Instagram Button */}
          <Button
            variant="outlined"
            onClick={onInstagramClick}
            startIcon={<Instagram />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 500,
              px: { xs: "24px", md: "32px" },
              py: { xs: "14px", md: "16px" },
              borderRadius: "16px",
              textTransform: "none",
              fontFamily: '"Poppins", sans-serif',
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              "&:hover": {
                borderColor: "#E1306C",
                color: "#E1306C",
                background: "rgba(225, 48, 108, 0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            Follow Us
          </Button>
        </Box>
      </Box>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "24px", md: "32px" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}>
        <IconButton
          onClick={scrollToContent}
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: { xs: "48px", md: "56px" },
            height: { xs: "48px", md: "56px" },
            backdropFilter: "blur(20px)",
            "&:hover": {
              color: "#6C5CE7",
              backgroundColor: "rgba(108, 92, 231, 0.1)",
              borderColor: "rgba(108, 92, 231, 0.3)",
              transform: "translateY(4px)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": {
                transform: "translateY(0)",
              },
              "40%": {
                transform: "translateY(-8px)",
              },
              "60%": {
                transform: "translateY(-4px)",
              },
            },
          }}>
          <ArrowDownward sx={{ fontSize: { xs: "20px", md: "24px" } }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeroSection;
