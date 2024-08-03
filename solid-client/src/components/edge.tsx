import { JSXElement } from "solid-js";
import { GraphEdge, GraphNode } from "../data-model/data-type";

import { useGraphContext } from "../context";
import "./edge.css";

export function Edge(props: {
  edge: GraphEdge;
  nodeList: GraphNode[];
}): JSXElement {
  const model = useGraphContext();

  const fromNode = () =>
    props.nodeList.find((it) => it.id === props.edge.startNodeId)!;
  const toNode = () =>
    props.nodeList.find((it) => it.id === props.edge.endNodeId)!;

  const handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    model.selectEdge(props.edge.id);
  };

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
