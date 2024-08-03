import { JSXElement } from "solid-js";

import { useGraphContext } from "../context";
import { GraphEdge } from "../data-model/data-type";

import "./edge.css";

export function Edge(props: { edge: GraphEdge }): JSXElement {
  const model = useGraphContext();
  const nodeList = model.graphStore.nodeList;

  const fromNode = () =>
    nodeList.find((it) => it.id === props.edge.startNodeId)!;
  const toNode = () => nodeList.find((it) => it.id === props.edge.endNodeId)!;

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    model.selectEdge(props.edge.id);
  }

  return (
    <>
      <line
        class="edge"
        classList={{
          "edge--unselected": !props.edge.selected,
          "edge--selected": props.edge.selected,
        }}
        x1={fromNode().x + fromNode().width / 2}
        y1={fromNode().y + fromNode().height / 2}
        x2={toNode().x + toNode().width / 2}
        y2={toNode().y + toNode().height / 2}
        onMouseDown={handleMouseDown}
      />
    </>
  );
}
