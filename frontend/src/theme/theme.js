import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#CCCCCC",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
    },
    divider: "#333333",
    error: {
      main: "#FF6B6B",
    },
    warning: {
      main: "#FFD93D",
    },
    success: {
      main: "#6BCF7F",
    },
    info: {
      main: "#4DABF7",
    },
  },
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#FFFFFF",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#FFFFFF",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#FFFFFF",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1rem",
      color: "#FFFFFF",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#CCCCCC",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#CCCCCC",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          borderBottom: "1px solid #333333",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          border: "1px solid #333333",
          borderRadius: "8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: "#FFFFFF",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#CCCCCC",
          },
        },
        outlined: {
          borderColor: "#FFFFFF",
          color: "#FFFFFF",
          "&:hover": {
            borderColor: "#CCCCCC",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#000000",
            "& fieldset": {
              borderColor: "#333333",
            },
            "&:hover fieldset": {
              borderColor: "#FFFFFF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFFFFF",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#CCCCCC",
          },
          "& .MuiInputBase-input": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333333",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFFFFF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFFFFF",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#333333",
          },
          "&.Mui-selected": {
            backgroundColor: "#333333",
            "&:hover": {
              backgroundColor: "#444444",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          border: "1px solid #333333",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333",
          color: "#FFFFFF",
          "& .MuiChip-deleteIcon": {
            color: "#CCCCCC",
            "&:hover": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000000",
          borderRight: "1px solid #333333",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#333333",
            "&:hover": {
              backgroundColor: "#444444",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000000",
          border: "1px solid #333333",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          border: "1px solid #333333",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
