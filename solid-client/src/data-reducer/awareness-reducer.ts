import { produce, SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";
import { Graph, NodeId } from "../data-model/data-type";

export type AwarenessAction =
  | { type: "clear"; nodeId: NodeId }
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

  function handleAwarenessChange(_changes: unknown) {
    const states = Object.fromEntries(awareness.getStates()) as AwarenessStates;
    // console.log("receive awareness", states);

    Object.entries(states).forEach(([clientID, state]) => {
      if (state != null && clientID !== String(awareness.clientID)) {
        switch (state.type) {
          case "inputNode":
            updateInputNode(state.userName, state.nodeId, state.text);
            break;
          case "moveNode":
            updateMoveNode(state.userName, state.nodeId, state.x, state.y);
            break;
        }
      }
    });
  }

  function updateInputNode(_userName: string, nodeId: NodeId, text: string) {
    setStore(
      produce((graph) => {
        const node = graph.nodeList.find((it) => it.id === nodeId);
        if (node != null) {
          node.text = text;
        }
      })
    );
  }

  function updateMoveNode(
    _userName: string,
    nodeId: NodeId,
    x: number,
    y: number
  ) {
    setStore(
      produce((graph) => {
        const node = graph.nodeList.find((it) => it.id === nodeId);
        if (node != null) {
          node.x = x;
          node.y = y;
        }
      })
    );
  }

  return { dispatch };
}
