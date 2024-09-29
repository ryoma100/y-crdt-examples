import { createSignal, JSXElement, Show } from "solid-js";

import { useGraphContext } from "../context";
import {
  GraphNode,
  NODE_HEIGHT,
  NODE_WIDTH,
  Point,
} from "../data-model/data-type";

import "./node.css";

export function Node(props: { node: GraphNode }): JSXElement {
  const { dataModel, awarenessDispatch } = useGraphContext();

  const [readonly, setReadonly] = createSignal(true);
  let prevClientPoint: Point = { x: 0, y: 0 };

  function handleFocusOut() {
    if (textareaRef == null) return; // guard

    awarenessDispatch({ type: "none" });
    if (props.node.text !== textareaRef.value) {
      dataModel.updateNodeText(props.node, textareaRef.value);
    }
    setReadonly(true);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (textareaRef == null) return; // guard

    if (!readonly() && e.key === "Escape") {
      textareaRef.setSelectionRange(0, 0);
      handleFocusOut();
    }
  }

  function handlePointerDown(e: PointerEvent) {
    e.stopPropagation();
    if (!readonly()) return;

    prevClientPoint = { x: e.clientX, y: e.clientY };

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

  function handlePointerUp(e: PointerEvent) {
    if (prevClientPoint.x === e.clientX && prevClientPoint.y === e.clientY) {
      setReadonly(false);
      textareaRef?.select();

      awarenessDispatch({
        type: "inputNode",
        nodeId: props.node.id,
        text: props.node.text,
      });
    }
  }

  function handleInput(_e: InputEvent) {
    if (textareaRef == null) return; // guard

    awarenessDispatch({
      type: "inputNode",
      nodeId: props.node.id,
      text: textareaRef.value,
    });
  }

  let textareaRef: HTMLTextAreaElement | undefined;
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
            "node--lock": props.node._lockTitle != null,
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
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
            inputMode="text"
            value={props.node.text}
            readOnly={readonly()}
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
