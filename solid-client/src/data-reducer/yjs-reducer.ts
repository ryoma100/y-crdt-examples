import * as Y from "yjs";

import { GraphEdge, GraphNode } from "../data-model/data-type";
import { convertYMap } from "../yjs-solidjs/yjs-solidjs";

export type YjsAction =
  | { type: "addNode"; node: GraphNode }
  | { type: "updateNode"; node: GraphNode }
  | { type: "addEdge"; edge: GraphEdge }
  | { type: "remove"; nodeIndex: number; edgeIndexes: number[] }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "init" }
  | { type: "load"; nodeList: GraphNode[]; edgeList: GraphEdge[] };

export function makeYjsReducer(yRoot: Y.Map<unknown>) {
  const undoManager = new Y.UndoManager(yRoot);

  const nodeList = () => yRoot.get("nodeList") as Y.Array<Y.Map<GraphNode>>;
  const edgeList = () => yRoot.get("edgeList") as Y.Array<Y.Map<GraphEdge>>;

  function dispatch(action: YjsAction): void {
    switch (action.type) {
      case "addNode":
        return addNode(action.node);
      case "updateNode":
        return updateNode(action.node);
      case "addEdge":
        return addEdge(action.edge);
      case "remove":
        return remove(action.nodeIndex, action.edgeIndexes);
      case "undo":
        return undo();
      case "redo":
        return redo();
      case "init":
        return init();
      case "load":
        return load(action.nodeList, action.edgeList);
    }
  }

  function addNode(node: GraphNode) {
    nodeList().insert(nodeList().length, [convertYMap(node)]);
    undoManager.stopCapturing();
  }

  function updateNode(node: GraphNode) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeList().forEach((yNode: Y.Map<any>) => {
      if (yNode.get("id") === node.id) {
        yRoot.doc?.transact(() => {
          const { selected: _, ...shareNode } = node;
          convertYMap(shareNode, yNode);
        });
      }
    });
  }

  function addEdge(edge: GraphEdge) {
    edgeList().insert(edgeList().length, [convertYMap(edge)]);
  }

  function remove(nodeIndex: number, edgeIndexes: number[]) {
    for (let i = edgeIndexes.length - 1; i >= 0; i--) {
      const index = edgeIndexes[i];
      edgeList().delete(index, 1);
    }
    if (0 <= nodeIndex) {
      nodeList().delete(nodeIndex, 1);
    }
  }

  function undo() {
    undoManager.undo();
  }

  function redo() {
    undoManager.redo();
  }

  function init() {
    edgeList().delete(0, edgeList().length);
    nodeList().delete(0, nodeList().length);
    undoManager.clear();
  }

  function load(nodes: GraphNode[], edges: GraphEdge[]) {
    init();
    nodeList().insert(
      0,
      nodes.map((it) => convertYMap(it))
    );
    edgeList().insert(
      0,
      edges.map((it) => convertYMap(it))
    );
    undoManager.clear();
  }

  return {
    dispatch,
  };
}
