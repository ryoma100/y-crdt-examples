import { batch, createSignal } from "solid-js";

import { SetStoreFunction } from "solid-js/store";
import { AwarenessAction } from "../data-reducer/awareness-reducer";
import { YjsAction } from "../data-reducer/yjs-reducer";
import { createEdge, createNode } from "./data-factory";
import {
  EdgeId,
  Graph,
  GraphNode,
  NODE_HEIGHT,
  NODE_WIDTH,
  NodeId,
  Point,
} from "./data-type";

export type ToolbarMode = "pointer" | "addNode" | "addEdge";
export type DragMode = "none" | "dragStart" | "dragMove";

export function makeDataModel(
  graphStore: Graph,
  yjsDispatch: (action: YjsAction) => void,
  awarenessDispatch: (action: AwarenessAction) => void,
  setGraphStore: SetStoreFunction<Graph>
) {
  const [toolbarMode, setToolbarMode] = createSignal<ToolbarMode>("pointer");
  const [dragMode, setDragMode] = createSignal<DragMode>("none");
  const [addingEdgeLine, setAddingEdgeLine] = createSignal<{
    startNodeId: NodeId;
    startPoint: Point;
    endPoint: Point;
  } | null>(null);

  function selectNode(nodeId: NodeId) {
    batch(() => {
      setGraphStore("nodeList", (node) => node.selected, "selected", false);
      setGraphStore("nodeList", (node) => node.id === nodeId, "selected", true);
      setGraphStore("edgeList", (edge) => edge.selected, "selected", false);
    });
  }

  function selectEdge(edgeId: EdgeId) {
    batch(() => {
      setGraphStore("nodeList", (node) => node.selected, "selected", false);
      setGraphStore("edgeList", (edge) => edge.selected, "selected", false);
      setGraphStore("edgeList", (edge) => edge.id === edgeId, "selected", true);
    });
  }

  function clearSelect() {
    batch(() => {
      setGraphStore("nodeList", (node) => node.selected, "selected", false);
      setGraphStore("edgeList", (edge) => edge.selected, "selected", false);
    });
  }

  function updateNodeText(node: GraphNode, text: string) {
    yjsDispatch({ type: "updateNode", node: { ...node, text } });
  }

  function dragStart(nodeId: NodeId) {
    selectNode(nodeId);
    setDragMode("dragStart");
  }

  function dragMove(movementX: number, movementY: number) {
    setDragMode("dragMove");
    setGraphStore(
      "nodeList",
      (node) => node.selected,
      (node) => ({
        ...node,
        x: node.x + movementX,
        y: node.y + movementY,
      })
    );

    const node = graphStore.nodeList.find((it) => it.selected);
    if (node) {
      awarenessDispatch({
        type: "moveNode",
        nodeId: node.id,
        x: node.x,
        y: node.y,
      });
    }
  }

  function dragEnd() {
    if (dragMode() === "dragMove") {
      const node = graphStore.nodeList.find((node) => node.selected);
      if (node) {
        awarenessDispatch({ type: "none" });
        yjsDispatch({ type: "updateNode", node });
      }
    }
    setDragMode("none");
  }

  function addNode(x: number, y: number) {
    const node = createNode(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2);
    yjsDispatch({ type: "addNode", node });
  }

  function addEdgeStart(node: GraphNode) {
    clearSelect();
    const point = {
      x: node.x + NODE_WIDTH / 2,
      y: node.y + NODE_HEIGHT / 2,
    };
    setAddingEdgeLine({
      startNodeId: node.id,
      startPoint: point,
      endPoint: point,
    });
    awarenessDispatch({ type: "addEdge", nodeId: node.id });
  }

  function addEdgeMove(x: number, y: number) {
    const line = addingEdgeLine();
    if (line != null) {
      setAddingEdgeLine({ ...line, endPoint: { x, y } });
    }
  }

  function addEdgeEnd(node: GraphNode | null = null) {
    const line = addingEdgeLine();
    if (line != null && node != null && line.startNodeId !== node.id) {
      if (
        graphStore.edgeList.every(
          (it) =>
            (it.startNodeId !== line.startNodeId || it.endNodeId !== node.id) &&
            (it.startNodeId !== node.id || it.endNodeId !== line.startNodeId)
        )
      ) {
        const edge = createEdge(line.startNodeId, node.id);
        yjsDispatch({ type: "addEdge", edge });
      }
    }
    setAddingEdgeLine(null);
    awarenessDispatch({ type: "none" });
  }

  function removeSelected() {
    const nodeIndex = graphStore.nodeList.findIndex((node) => node.selected);
    const nodeId = 0 <= nodeIndex ? graphStore.nodeList[nodeIndex].id : null;
    const edgeIndexList = graphStore.edgeList
      .map((node, idx) =>
        node.selected ||
        node.startNodeId === nodeId ||
        node.endNodeId === nodeId
          ? idx
          : -1
      )
      .filter((idx) => 0 <= idx);
    yjsDispatch({ type: "remove", nodeIndex, edgeIndexes: edgeIndexList });
  }

  return {
    graphStore,
    setGraphStore,
    toolbarMode,
    setToolbarMode,
    dragMode,
    selectNode,
    selectEdge,
    clearSelect,
    updateNodeText,
    dragStart,
    dragMove,
    dragEnd,
    addNode,
    addingEdgeLine,
    addEdgeStart,
    addEdgeMove,
    addEdgeEnd,
    setAddingEdgeLine,
    removeSelected,
  };
}
