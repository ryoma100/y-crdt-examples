import { JSXElement, createSignal } from "solid-js";

import { useGraphContext } from "../context";
import { GraphNode } from "../data-model/data-type";

import "./node.css";

export function Node(props: { node: GraphNode }): JSXElement {
  const model = useGraphContext();

  const [readonly, setReadonly] = createSignal(true);

  function handleDblClick() {
    setReadonly(false);
    textareaRef?.select();
  }

  function handleFocusOut() {
    setTimeout(() => {
      // Wait a moment to deselect textarea.
      textareaRef?.setSelectionRange(0, 0);
      setReadonly(true);
    }, 0);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!readonly() && e.key === "Escape") {
      e.stopPropagation();
      handleFocusOut();
    }
  }

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    if (!readonly()) return;

    switch (model.toolbarMode()) {
      case "pointer":
      case "addNode":
        model.dragStart(props.node.id);
        break;
      case "addEdge":
        model.addEdgeStart(props.node);
        break;
    }
  }

  function handleMouseUp() {
    if (model.toolbarMode() === "addEdge") {
      model.addEdgeEnd(props.node);
    }
  }

  let textareaRef: HTMLTextAreaElement | undefined;
  return (
    <foreignObject
      x={props.node.x}
      y={props.node.y}
      width={props.node.width}
      height={props.node.height}
    >
      <div
        class="node"
        classList={{ "node--selected": props.node.selected }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDblClick={handleDblClick}
      >
        <textarea
          ref={textareaRef}
          class="node__textarea"
          classList={{
            "node__textarea--readonly": readonly(),
            "node__textarea--editable": !readonly(),
          }}
          style={{
            width: `${props.node.width - 6}px`,
            height: `${props.node.height - 6}px`,
          }}
          value={props.node.text}
          readOnly={readonly()}
          onKeyDown={handleKeyDown}
          onFocusOut={handleFocusOut}
        />
        <div />
      </div>
    </foreignObject>
  );
}
