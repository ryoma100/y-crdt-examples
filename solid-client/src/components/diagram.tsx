import { For, JSXElement, Show } from "solid-js";

import { useGraphContext } from "../context";
import { Edge } from "./edge";
import { Node } from "./node";

import "./diagram.css";

export function Diagram(): JSXElement {
  const model = useGraphContext();

  function handleMouseDown(e: MouseEvent) {
    model.clearSelect();
    if (model.toolbarMode() === "addNode") {
      model.addNode(e.clientX, e.clientY);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (model.dragMode() === "drag") {
      model.dragMove(e.movementX, e.movementY);
    }
    if (model.addingEdgeLine() != null) {
      model.addEdgeMove(e.clientX, e.clientY);
    }
  }

  function handleMouseUp() {
    switch (model.toolbarMode()) {
      case "pointer":
      case "addNode":
        model.dragEnd();
        break;
      case "addEdge":
        model.addEdgeEnd();
        break;
    }
  }

  return (
    <svg
      class="diagram"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <g data-id="edges">
        <For each={model.graphStore.edgeList}>{(edge) => Edge({ edge })}</For>
      </g>
      <g data-id="nodes">
        <For each={model.graphStore.nodeList}>{(node) => Node({ node })}</For>
      </g>
      <g data-id="addingLine">
        <Show when={model.addingEdgeLine() != null}>
          <line
            class="adding-line"
            x1={model.addingEdgeLine()?.startPoint.x}
            y1={model.addingEdgeLine()?.startPoint.y}
            x2={model.addingEdgeLine()?.endPoint.x}
            y2={model.addingEdgeLine()?.endPoint.y}
          />
        </Show>
      </g>
    </svg>
  );
}
