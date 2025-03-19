import {createTheme,ThemeProvider} from "@mui/material/styles";

export const theme= createTheme({
    palette: {
        primary: {
            main: "#f44336",
        },
        secondary: {
            main: "#3f51b5",
        },
    },
    components: {
        MuiCssBaseline: {
          styleOverrides: `
            @font-face {
              font-family: 'Poppins';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('Poppins'), local('Poppins-Regular'), url(@fontsource/poppins/files/poppins-all-400-normal.woff) format('woff');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
      },
    });

    export const MuiThemeProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      );