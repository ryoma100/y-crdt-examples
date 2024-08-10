import "./App.css";
import { Diagram } from "./components/diagram";
import { ToolMenu } from "./components/tool-menu";
import { useGraphContext } from "./context";

export type MouseMode = "pointer" | "addNode" | "addEdge";

function App() {
  const { dataModel } = useGraphContext();

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
