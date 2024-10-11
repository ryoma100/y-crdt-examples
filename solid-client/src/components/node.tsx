import { createSignal, JSXElement, Show } from "solid-js";

import { useGraphContext } from "../context";
import { GraphNode, NODE_HEIGHT, NODE_WIDTH } from "../data-store/data-type";

import "./node.css";

export function Node(props: { node: GraphNode }): JSXElement {
  const { dataModel, awarenessDispatch } = useGraphContext();

  const [readonly, setReadonly] = createSignal(true);

  function handleFocusOut() {
    awarenessDispatch({ type: "none" });
    if (props.node.text !== textareaRef.value) {
      dataModel.updateNodeText(props.node, textareaRef.value);
    }
    setReadonly(true);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!readonly() && e.key === "Escape") {
      textareaRef.setSelectionRange(0, 0);
      handleFocusOut();
    }
  }

  function handlePointerDown(e: PointerEvent) {
    e.stopPropagation(); // Required to trigger onPointerMove

    if (readonly() && props.node._lockTitle == null) {
      switch (dataModel.toolbarMode()) {
        case "pointer":
        case "addNode":
          dataModel.dragStart(props.node.id, e.clientX, e.clientY);
          break;
        case "addEdge":
          dataModel.addEdgeStart(props.node);
          break;
      }
    }
  }

  function handleDblClick(_e: MouseEvent) {
    if (!readonly()) return;

    setReadonly(false);
    textareaRef.select();

    awarenessDispatch({
      type: "inputNode",
      nodeId: props.node.id,
      text: props.node.text,
    });
  }

  function handleInput(_e: InputEvent) {
    awarenessDispatch({
      type: "inputNode",
      nodeId: props.node.id,
      text: textareaRef.value,
    });
  }

  let textareaRef: HTMLTextAreaElement;
  return (
    <>
      <Show when={props.node._lockTitle != null}>
        <foreignObject
          x={props.node.x}
          y={props.node.y - 24}
          width={NODE_WIDTH * 2}
          height={24}
        >
          <span class="node__lock-title">{props.node._lockTitle}</span>
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
            "node--selected": props.node._selected,
            "node--readonly": readonly(),
            "node--lock": props.node._lockTitle != null,
          }}
          onPointerDown={handlePointerDown}
          onDblClick={handleDblClick}
        >
          <textarea
            ref={textareaRef!}
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
            inputMode="text"
            value={props.node.text}
            disabled={props.node._lockTitle != null}
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
