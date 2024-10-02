import { createSignal, For } from "solid-js";
import { useGraphContext } from "../context";

import { createSampleGraph } from "../data-store/data-factory";
import "./tool-menu.css";

export function ToolMenu() {
  return (
    <>
      <div class="tool-menu__container">
        <DrawMenu />
        <DebugMenu />
      </div>
      <div class="user-menu__container">
        <UserMenu />
      </div>
    </>
  );
}

function DrawMenu() {
  const { dataModel, yjsDispatch } = useGraphContext();

  return (
    <div class="tool-menu">
      <input
        type="radio"
        name="toolbar"
        id="toolbar-point"
        class="tool-menu__radio"
        value="pointer"
        checked={dataModel.toolbarMode() === "pointer"}
        onChange={() => dataModel.setToolbarMode("pointer")}
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
        checked={dataModel.toolbarMode() === "addNode"}
        onChange={() => dataModel.setToolbarMode("addNode")}
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
        checked={dataModel.toolbarMode() === "addEdge"}
        onChange={() => dataModel.setToolbarMode("addEdge")}
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
        onClick={() => dataModel.removeSelected()}
      >
        <img
          src="delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <div class="tool-menu__line" />

      <button
        class="tool-menu__item"
        title="Undo"
        onClick={() => yjsDispatch({ type: "undo" })}
      >
        <img
          src="undo_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <button
        class="tool-menu__item"
        title="Redo"
        onClick={() => yjsDispatch({ type: "redo" })}
      >
        <img
          src="redo_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>
    </div>
  );
}

function UserMenu() {
  const { awarenessDispatch, dataStore } = useGraphContext();

  function handleUserNameFocusOut(_e: Event) {
    dataStore.setUserStore("userName", inputRef.value);
    awarenessDispatch({ type: "none" });
  }

  let inputRef: HTMLInputElement;
  return (
    <div class="user-menu">
      <input
        ref={inputRef!}
        class="user-menu__input"
        type="text"
        inputMode="text"
        value={dataStore.userStore.userName}
        onFocusOut={handleUserNameFocusOut}
      />
      <For each={dataStore.userStore.otherUserList}>
        {(userName) => <div class="user-menu__label">{userName}</div>}
      </For>
    </div>
  );
}

function DebugMenu() {
  const { connect, disconnect, yjsDispatch } = useGraphContext();
  const [online, setOnline] = createSignal(true);

  function handleOnlineClick() {
    setOnline(true);
    connect();
  }

  function handleOfflineClick() {
    setOnline(false);
    disconnect();
  }

  function handleLoadSampleClick() {
    const { nodeList, edgeList } = createSampleGraph();
    yjsDispatch({ type: "load", nodeList, edgeList });
  }

  return (
    <div class="tool-menu">
      <button
        class="tool-menu__item"
        title="Initialize"
        onClick={() => yjsDispatch({ type: "init" })}
      >
        <img
          src="new_window_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <button
        class="tool-menu__item"
        title="Load Sample"
        onClick={handleLoadSampleClick}
      >
        <img
          src="auto_stories_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
          class="tool-menu__img"
        />
      </button>

      <div class="tool-menu__line" />

      <input
        type="radio"
        name="network"
        id="toolbar-online"
        class="tool-menu__radio"
        value="online"
        checked={online()}
        onChange={handleOnlineClick}
      />
      <div class="tool-menu__item">
        <label title="Offline" for="toolbar-online" class="tool-menu__label">
          <img
            src="wifi_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            class="tool-menu__img"
          />
        </label>
      </div>

      <input
        type="radio"
        name="network"
        id="toolbar-offline"
        class="tool-menu__radio"
        value="offline"
        checked={!online()}
        onChange={handleOfflineClick}
      />
      <div class="tool-menu__item">
        <label title="Online" for="toolbar-offline" class="tool-menu__label">
          <img
            src="wifi_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg"
            class="tool-menu__img"
          />
        </label>
      </div>
    </div>
  );
}
