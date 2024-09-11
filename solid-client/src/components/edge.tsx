import { JSXElement } from "solid-js";

import { useGraphContext } from "../context";
import { GraphEdge, NODE_HEIGHT, NODE_WIDTH } from "../data-model/data-type";

import "./edge.css";

export function Edge(props: { edge: GraphEdge }): JSXElement {
  const { dataModel } = useGraphContext();
  const nodeList = dataModel.graphStore.nodeList;

  const fromNode = () =>
    nodeList.find((it) => it.id === props.edge.startNodeId)!;
  const toNode = () => nodeList.find((it) => it.id === props.edge.endNodeId)!;

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    dataModel.selectEdge(props.edge.id);
  }

  return (
    <>
      <line
        class="edge"
        classList={{
          "edge--unselected": !props.edge._selected,
          "edge--selected": props.edge._selected,
        }}
        x1={fromNode().x + NODE_WIDTH / 2}
        y1={fromNode().y + NODE_HEIGHT / 2}
        x2={toNode().x + NODE_WIDTH / 2}
        y2={toNode().y + NODE_HEIGHT / 2}
        onMouseDown={handleMouseDown}
      />
    </>
  );
}
