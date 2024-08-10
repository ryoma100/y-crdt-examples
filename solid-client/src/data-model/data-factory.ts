import {
  Graph,
  GraphEdge,
  GraphNode,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "./data-type";

export function createNode(
  x: number,
  y: number,
  selected: boolean = false
): GraphNode {
  return {
    id: crypto.randomUUID(),
    x,
    y,
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
  return {
    nodeList: [],
    edgeList: [],
  };
}

export function createSampleGraph(): Graph {
  const nodeList = [...Array(5)].flatMap((_, index) => [
    {
      ...createNode(NODE_WIDTH * index + 60, (NODE_HEIGHT + 20) * index + 60),
      id: `node-${index * 2}`,
      text: `node-${index * 2}`,
    },
    {
      ...createNode(
        NODE_WIDTH * (4 - index) + 60,
        (NODE_HEIGHT + 20) * index + 60
      ),
      id: `node-${index * 2 + 1}`,
      text: `node-${index * 2 + 1}`,
    },
  ]);
  const edgeList: GraphEdge[] = nodeList.map((node, index) => {
    const nextNode = nodeList[index < nodeList.length - 1 ? index + 1 : 0];
    return createEdge(node.id, nextNode.id);
  });

  return {
    nodeList,
    edgeList,
  };
}
