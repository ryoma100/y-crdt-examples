export type Point = {
  x: number;
  y: number;
};

export type Line = { start: Point; end: Point };

export type Size = {
  width: number;
  height: number;
};

export type Rectangle = Point & Size;

export type NodeId = string;
export type EdgeId = string;

export type GraphNode = {
  id: NodeId;
  text: string;
  selected: boolean;
} & Rectangle;

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
