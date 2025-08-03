import { Box, Typography } from "@mui/material";

const ThankYouSection = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: "100px",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        px: { xs: "20px", md: "40px" },
      }}>
      <Typography
        sx={{
          fontSize: { xs: "36px", sm: "50px", md: "60px" },
          fontWeight: 700,
          color: "#FFFFFF",
        }}>
        Thank
        <br />
        You
      </Typography>
    </Box>
  );
};

export default ThankYouSection;
