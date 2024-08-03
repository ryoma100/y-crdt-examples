/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import { GraphProvider } from "./context";
import "./index.css";

render(
  () => (
    <GraphProvider>
      <App />
    </GraphProvider>
  ),
  document.getElementById("root") as HTMLElement
);
