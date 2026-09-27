import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { TauFindProvider } from "./context/TauFindContext";
import { I18nProvider } from "./i18n/I18nContext";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <TauFindProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </TauFindProvider>
    </BrowserRouter>
  </StrictMode>,
);
