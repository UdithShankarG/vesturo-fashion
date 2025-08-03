import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  IconButton,
} from "@mui/material";
import { Instagram } from "@mui/icons-material";

const Header = ({ onInstagramClick }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}>
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}>
        <Toolbar
          sx={{
            px: { xs: "24px", md: "48px" },
            py: { xs: "16px", md: "20px" },
            minHeight: { xs: "64px", md: "72px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            boxSizing: "border-box",
          }}>
          {/* Logo */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "20px", md: "24px" },
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              fontFamily: '"Poppins", sans-serif',
            }}>
            VESTURO
          </Typography>

          {/* Right Section - Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "8px", md: "12px" },
            }}>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                width: { xs: "36px", md: "40px" },
                height: { xs: "36px", md: "40px" },
                borderRadius: "12px",
                "&:hover": {
                  color: "#E1306C",
                  backgroundColor: "rgba(225, 48, 108, 0.1)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <Instagram sx={{ fontSize: { xs: "18px", md: "20px" } }} />
            </IconButton>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#6C5CE7",
                color: "#FFFFFF",
                px: { xs: "16px", md: "24px" },
                py: { xs: "8px", md: "10px" },
                borderRadius: "12px",
                fontSize: { xs: "13px", md: "14px" },
                fontWeight: 600,
                textTransform: "none",
                fontFamily: '"Poppins", sans-serif',
                boxShadow: "0 4px 12px rgba(108, 92, 231, 0.3)",
                "&:hover": {
                  bgcolor: "#5A4FCF",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 16px rgba(108, 92, 231, 0.4)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                display: { xs: "none", sm: "flex" },
              }}>
              Follow
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
