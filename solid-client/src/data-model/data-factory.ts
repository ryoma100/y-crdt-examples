import { Graph, GraphEdge, GraphNode } from "./data-type";

export function createNode(
  x: number,
  y: number,
  selected: boolean = false
): GraphNode {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    width: 160,
    height: 80,
    text: "node",
    selected,
  };
}

export function createEdge(
  startNodeId: string,
  endNodeId: string,
  selected: boolean = false
): GraphEdge {
  return {
    id: crypto.randomUUID(),
    startNodeId,
    endNodeId,
    selected,
  };
}

export function createDefaultGraph(): Graph {
  const node1 = createNode(80, 80);
  const node2 = createNode(240, 240);
  const node3 = createNode(400, 80);
  const edge1to2 = createEdge(node1.id, node2.id);
  const edge2to3 = createEdge(node2.id, node3.id);
  return {
    nodeList: [node1, node2, node3],
    edgeList: [edge1to2, edge2to3],
  };
}
