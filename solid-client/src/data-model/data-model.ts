import { batch, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { createDefaultGraph, createEdge, createNode } from "./data-factory";
import { EdgeId, Graph, GraphNode, NodeId, Point } from "./data-type";

export type ToolbarMode = "pointer" | "addNode" | "addEdge";
export type DragMode = "none" | "drag";

export function makeDataModel() {
  const [graphStore, setGraphStore] = createStore<Graph>(createDefaultGraph());
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

  function dragStart(nodeId: NodeId) {
    selectNode(nodeId);
    setDragMode("drag");
  }

  function dragMove(movementX: number, movementY: number) {
    setGraphStore(
      "nodeList",
      (node) => node.selected,
      (node) => ({
        ...node,
        x: node.x + movementX,
        y: node.y + movementY,
      })
    );
  }

  function dragEnd() {
    setDragMode("none");
  }

  function addNode(x: number, y: number) {
    const node = createNode(x, y, true);
    setGraphStore("nodeList", graphStore.nodeList.length, node);
  }

  function addEdgeStart(node: GraphNode) {
    clearSelect();
    const point = {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    };
    setAddingEdgeLine({
      startNodeId: node.id,
      startPoint: point,
      endPoint: point,
    });
  }

  function addEdgeMove(x: number, y: number) {
    const line = addingEdgeLine();
    if (line != null) {
      setAddingEdgeLine({ ...line, endPoint: { x, y } });
    }
  }

  function addEdgeEnd(node: GraphNode | null = null) {
    const line = addingEdgeLine();
    if (line != null && node != null && line.startNodeId != node.id) {
      if (
        graphStore.edgeList.every(
          (it) =>
            (it.startNodeId !== line.startNodeId || it.endNodeId !== node.id) &&
            (it.startNodeId !== node.id || it.endNodeId !== line.startNodeId)
        )
      ) {
        const edge = createEdge(line.startNodeId, node.id, true);
        setGraphStore("edgeList", graphStore.edgeList.length, edge);
      }
    }
    setAddingEdgeLine(null);
  }

  function removeSelected() {
    batch(() => {
      graphStore.nodeList
        .filter((node) => node.selected)
        .forEach((node) =>
          setGraphStore(
            "edgeList",
            (edge) =>
              edge.startNodeId === node.id || edge.endNodeId === node.id,
            "selected",
            true
          )
        );
      setGraphStore(
        "edgeList",
        graphStore.edgeList.filter((edge) => !edge.selected)
      );
      setGraphStore(
        "nodeList",
        graphStore.nodeList.filter((node) => !node.selected)
      );
    });
  }

  return {
    graphStore,
    toolbarMode,
    setToolbarMode,
    dragMode,
    selectNode,
    selectEdge,
    clearSelect,
    dragStart,
    dragMove,
    dragEnd,
    addNode,
    addingEdgeLine,
    addEdgeStart,
    addEdgeMove,
    addEdgeEnd,
    removeSelected,
  };
}
