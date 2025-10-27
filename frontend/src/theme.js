import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#0288d1" },
    background: { default: "#f4f6fa" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 20 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
  },
});
export default theme;
