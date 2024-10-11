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

// cancel iOS back swipe
window.addEventListener(
  "touchstart",
  (e) => {
    const SWIPE_WIDTH = 24;
    const pageX = e.touches[0].pageX;
    if (!(pageX > SWIPE_WIDTH && pageX < window.innerWidth - SWIPE_WIDTH)) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// cancel touch panel zoom on mac
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);
