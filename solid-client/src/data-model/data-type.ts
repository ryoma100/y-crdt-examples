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
  lockTitle?: string;
} & Point;

export const NODE_WIDTH = 120;
export const NODE_HEIGHT = 60;

export type GraphEdge = {
  id: EdgeId;
  startNodeId: NodeId;
  endNodeId: NodeId;
  selected: boolean;
};

export type GraphStore = {
  nodeList: GraphNode[];
  edgeList: GraphEdge[];
};

export type UserStore = {
  userName: string;
  otherUserList: string[];
};
