export type Point = {
  x: number;
  y: number;
};

export type Line = { start: Point; end: Point };

export type NodeId = string;
export type EdgeId = string;

export type GraphNode = {
  id: NodeId;
  text: string;
  selected: boolean;
} & Point;

export const NODE_WIDTH = 120;
export const NODE_HEIGHT = 60;

export type GraphEdge = {
  id: EdgeId;
  startNodeId: NodeId;
  endNodeId: NodeId;
  selected: boolean;
};

export type Graph = {
  nodeList: GraphNode[];
  edgeList: GraphEdge[];
};
