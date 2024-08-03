import { useGraphContext } from "../context";
import "./tool-menu.css";

export function ToolMenu() {
  const model = useGraphContext();

  return (
    <div class="tool-menu">
      <input
        type="radio"
        name="toolbar"
        id="toolbar-point"
        class="tool-menu__radio"
        value="pointer"
        checked={model.toolbarMode() === "pointer"}
        onChange={() => model.setToolbarMode("pointer")}
      />
      <div class="tool-menu__item">
        <label title="Point" for="toolbar-point" class="tool-menu__label">
          <img
            src="arrow_selector_tool_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            class="tool-menu__img"
          />
        </label>
      </div>

      <input
        type="radio"
        name="toolbar"
        id="toolbar-node"
        class="tool-menu__radio"
        value="addNode"
        checked={model.toolbarMode() === "addNode"}
        onChange={() => model.setToolbarMode("addNode")}
      />
      <div class="tool-menu__item">
        <label title="Node" for="toolbar-node" class="tool-menu__label">
          <img
            src="check_box_outline_blank_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            class="tool-menu__img"
          />
        </label>
      </div>

      <input
        type="radio"
        name="toolbar"
        id="toolbar-edge"
        class="tool-menu__radio"
        value="addEdge"
        checked={model.toolbarMode() === "addEdge"}
        onChange={() => model.setToolbarMode("addEdge")}
      />
      <div class="tool-menu__item">
        <label title="Edge" for="toolbar-edge" class="tool-menu__label">
          <img
            src="north_east_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            class="tool-menu__img"
          />
        </label>
      </div>

      <div class="tool-menu__line" />

      <button
        class="tool-menu__item"
        title="Delete"
        onClick={() => model.removeSelected()}
      >
        <img
          src="delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <div class="tool-menu__line" />

      <button class="tool-menu__item" title="Undo">
        <img
          src="undo_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <button class="tool-menu__item" title="Redo">
        <img
          src="redo_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>
    </div>
  );
}
