import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: "50px",
        pb: "20px",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        px: { xs: "20px", md: "40px" },
      }}>
      <Typography
        sx={{
          fontSize: "12px",
          color: "#AAAAAA",
        }}>
        © copyright Received _vesturo.
      </Typography>
    </Box>
  );
};

export default Footer;
