import { TauriEvent } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";

import { Diagram } from "./components/diagram";
import { ToolMenu } from "./components/tool-menu";
import { useGraphContext } from "./context";

import "./App.css";

export type MouseMode = "pointer" | "addNode" | "addEdge";

function App() {
  const { dataModel, logout } = useGraphContext();

  if ("__TAURI_IPC__" in window) {
    appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
      logout();
    });
  } else {
    window.addEventListener("beforeunload", function (_e) {
      logout();
    });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      dataModel.setToolbarMode("pointer");
    }
  }

  return (
    <div class="container" tabIndex={-1} onKeyDown={handleKeyDown}>
      <Diagram />
      <ToolMenu />
    </div>
  );
}

export default App;
