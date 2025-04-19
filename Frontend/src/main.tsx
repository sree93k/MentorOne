import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import store, { persistor } from "./redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import GlobalTransitionWrapper from "./components/users/PageTansistion";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <GlobalTransitionWrapper>
          <App />
        </GlobalTransitionWrapper>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
