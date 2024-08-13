import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import store from "./store/store"
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
