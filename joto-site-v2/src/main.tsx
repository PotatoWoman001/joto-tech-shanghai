import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initBaiduAnalytics } from "./analytics/baidu";
import { I18nProvider } from "./i18n/I18nProvider";
import "./index.css";

initBaiduAnalytics();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
