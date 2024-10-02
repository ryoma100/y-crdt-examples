type Brand<K, T> = K & { __brand: T };

export type Point = {
  x: number;
  y: number;
};

export type Line = { start: Point; end: Point };

export type NodeId = Brand<string, "NodeId">;
export type EdgeId = Brand<string, "EdgeId">;

export type GraphNode = {
  id: NodeId;
  text: string;
  _selected?: boolean; // transient
  _lockTitle?: string; // transient
} & Point;

export const NODE_WIDTH = 120;
export const NODE_HEIGHT = 60;

export type GraphEdge = {
  id: EdgeId;
  startNodeId: NodeId;
  endNodeId: NodeId;
  _selected?: boolean; // transient
};

export type GraphStore = {
  nodeList: GraphNode[];
  edgeList: GraphEdge[];
};

export type UserStore = {
  userName: string;
  otherUserList: string[];
};
