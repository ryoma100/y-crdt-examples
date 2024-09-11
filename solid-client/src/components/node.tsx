import { JSXElement, Show, createSignal } from "solid-js";

import { useGraphContext } from "../context";
import { GraphNode, NODE_HEIGHT, NODE_WIDTH } from "../data-model/data-type";

import "./node.css";

export function Node(props: { node: GraphNode }): JSXElement {
  const { dataModel, awarenessDispatch } = useGraphContext();

  const [readonly, setReadonly] = createSignal(true);

  function handleDblClick() {
    setReadonly(false);
    textareaRef?.select();
    awarenessDispatch({
      type: "inputNode",
      nodeId: props.node.id,
      text: props.node.text,
    });
  }

  function handleFocusOut() {
    if (textareaRef == null) return;

    awarenessDispatch({ type: "none" });
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
    e.preventDefault();
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

  function handleInput(_e: InputEvent) {
    if (textareaRef == null) return;

    awarenessDispatch({
      type: "inputNode",
      nodeId: props.node.id,
      text: textareaRef.value,
    });
  }

  let textareaRef: HTMLTextAreaElement | undefined;
  return (
    <>
      <Show when={props.node.lockTitle != null}>
        <foreignObject
          x={props.node.x}
          y={props.node.y - 24}
          width={NODE_WIDTH * 2}
          height={24}
        >
          <span class="node__lock-title">{props.node.lockTitle}</span>
        </foreignObject>
      </Show>
      <foreignObject
        x={props.node.x}
        y={props.node.y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
      >
        <div
          class="node"
          classList={{
            "node--selected": props.node.selected,
            "node--lock": props.node.lockTitle != null,
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDblClick={handleDblClick}
        >
          <textarea
            ref={textareaRef}
            name="textarea"
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
            disabled={props.node.lockTitle != null}
            onKeyDown={handleKeyDown}
            onFocusOut={handleFocusOut}
            onInput={handleInput}
          />
          <div />
        </div>
      </foreignObject>
    </>
  );
}
