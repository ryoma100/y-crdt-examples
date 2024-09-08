import { produce, SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";
import { Graph, NodeId } from "../data-model/data-type";

export type AwarenessAction =
  | { type: "none" }
  | {
      type: "inputNode";
      nodeId: NodeId;
      text: string;
    }
  | {
      type: "moveNode";
      nodeId: NodeId;
      x: number;
      y: number;
    }
  | {
      type: "addEdge";
      nodeId: NodeId;
    };

type AwarenessState = {
  userName: string;
} & AwarenessAction;

type AwarenessStates = Record</* clientId */ string, AwarenessState>;

export function makeAwarenessReducer(
  provider: WebsocketProvider,
  setStore: SetStoreFunction<Graph>
) {
  const awareness = provider.awareness;
  awareness.on("change", handleAwarenessChange);

  function dispatch(action: AwarenessAction): void {
    const state: AwarenessState = { userName: "user1", ...action };
    awareness.setLocalState(state);
  }

  function clear(): void {
    awareness.setLocalState(null);
  }

  function handleAwarenessChange(_changes: unknown) {
    const states = Object.fromEntries(awareness.getStates()) as AwarenessStates;
    // console.log("receive awareness", states);

    Object.entries(states).forEach(([clientID, state]) => {
      if (state != null && clientID !== String(awareness.clientID)) {
        switch (state.type) {
          case "none":
            unlockNode();
            break;
          case "inputNode":
            updateInputNode(state.userName, state.nodeId, state.text);
            break;
          case "moveNode":
            updateMoveNode(state.userName, state.nodeId, state.x, state.y);
            break;
          case "addEdge":
            updateAddEdgeNode(state.userName, state.nodeId);
            break;
        }
      }
    });
  }

  function unlockNode() {
    setStore(
      "nodeList",
      (node) => node.lockTitle != null,
      (node) => ({ ...node, lockTitle: undefined })
    );
  }

  function updateInputNode(userName: string, nodeId: NodeId, text: string) {
    setStore(
      produce((graph) => {
        const node = graph.nodeList.find((it) => it.id === nodeId);
        if (node != null) {
          node.lockTitle = `${userName} inputting`;
          node.text = text;
        }
      })
    );
  }

  function updateMoveNode(
    userName: string,
    nodeId: NodeId,
    x: number,
    y: number
  ) {
    setStore(
      produce((graph) => {
        const node = graph.nodeList.find((it) => it.id === nodeId);
        if (node != null) {
          node.lockTitle = `${userName} moving`;
          node.x = x;
          node.y = y;
        }
      })
    );
  }

  function updateAddEdgeNode(userName: string, nodeId: NodeId) {
    setStore(
      produce((graph) => {
        const node = graph.nodeList.find((it) => it.id === nodeId);
        if (node != null) {
          node.lockTitle = `${userName} adding edge`;
        }
      })
    );
  }

  return { dispatch, clear };
}
