import "./App.css";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./hooks/ErrorBoundary";
import { ThemeProvider } from "./utils/ThemeProvider";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
