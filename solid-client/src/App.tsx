import "./App.css";
import { Diagram } from "./components/diagram";
import { ToolMenu } from "./components/tool-menu";

function App() {
  return (
    <div class="container">
      <Diagram />
      <ToolMenu />
    </div>
  );
}

export default App;
