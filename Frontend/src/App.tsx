// import "./App.css";
// import AppRouter from "./routes/AppRouter";
// import ErrorBoundary from "./hooks/ErrorBoundary";
// import { ThemeProvider } from "./utils/ThemeProvider";

// function App() {
//   return (
//     <ErrorBoundary>
//       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//         <AppRouter />
//       </ThemeProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;
import "./App.css";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./hooks/ErrorBoundary";
import { ThemeProvider } from "./utils/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
