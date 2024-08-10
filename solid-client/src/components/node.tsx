import { JSXElement, createSignal } from "solid-js";

import { useGraphContext } from "../context";
import { GraphNode, NODE_HEIGHT, NODE_WIDTH } from "../data-model/data-type";

import "./node.css";

export function Node(props: { node: GraphNode }): JSXElement {
  const { dataModel } = useGraphContext();

  const [readonly, setReadonly] = createSignal(true);

  function handleDblClick() {
    setReadonly(false);
    textareaRef?.select();
  }

  function handleFocusOut() {
    if (textareaRef == null) return;

    if (props.node.text !== textareaRef.value) {
      dataModel.updateNodeText(props.node, textareaRef.value);
    }
    setTimeout(() => {
      // Wait a moment to deselect textarea.
      textareaRef.setSelectionRange(0, 0);
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

    switch (dataModel.toolbarMode()) {
      case "pointer":
      case "addNode":
        dataModel.dragStart(props.node.id);
        break;
      case "addEdge":
        dataModel.addEdgeStart(props.node);
        break;
    }
  }

  function handleMouseUp() {
    if (dataModel.toolbarMode() === "addEdge") {
      dataModel.addEdgeEnd(props.node);
    }
  }

  let textareaRef: HTMLTextAreaElement | undefined;
  return (
    <foreignObject
      x={props.node.x}
      y={props.node.y}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
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
            width: `${NODE_WIDTH - 6}px`,
            height: `${NODE_HEIGHT - 6}px`,
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
