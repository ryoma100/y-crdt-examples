import { SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { bindYjsToStore, convertYMap } from "../yjs-solidjs/yjs-solidjs";
import { Graph, GraphEdge, GraphNode } from "./data-type";

export type YjsAction =
  | { type: "addNode"; node: GraphNode }
  | { type: "updateNode"; node: GraphNode }
  | { type: "addEdge"; edge: GraphEdge }
  | { type: "remove"; nodeIndex: number; edgeIndexes: number[] }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "init" }
  | { type: "load"; nodeList: GraphNode[]; edgeList: GraphEdge[] };

export function createYjsReducer(setStore: SetStoreFunction<Graph>) {
  const yDoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "ws://localhost:1234",
    "graph-example.room-1",
    yDoc
  );

  const yRoot = yDoc.getMap("graph-example.v1");
  yRoot.set("nodeList", new Y.Array<Y.Map<GraphNode>>());
  yRoot.set("edgeList", new Y.Array<Y.Map<GraphEdge>>());
  const undoManager = new Y.UndoManager(yRoot);
  bindYjsToStore(yRoot, setStore);

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
        yDoc.transact(() => {
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
    provider,
  };
}
