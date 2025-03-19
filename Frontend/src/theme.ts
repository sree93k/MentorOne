import { createTheme } from '@mui/material/styles';

// Custom theme based on the Figma design
export const theme = createTheme({
  palette: {
    primary: {
      main: '#e44332',
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#227bef',
      light: '#6aa8ff',
      dark: '#0052bc',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2f9731',
    },
    background: {
      default: '#f7f6f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#444444',
      secondary: '#828282',
    },
    divider: '#d5d3d3',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export default theme;