import { SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";
import { GraphStore, NodeId, UserStore } from "../data-model/data-type";

export type AwarenessAction =
  | { type: "none" }
  | { type: "inputNode"; nodeId: NodeId; text: string }
  | { type: "moveNode"; nodeId: NodeId; x: number; y: number }
  | { type: "addEdge"; nodeId: NodeId }
  | { type: "unlockNode"; nodeId: NodeId };

type AwarenessState = AwarenessAction & {
  userName: string;
};
type AwarenessStates = Record</* clientId */ string, AwarenessState>;

export function makeAwarenessReducer(
  provider: WebsocketProvider,
  userStore: UserStore,
  setGraphStore: SetStoreFunction<GraphStore>,
  setUserStore: SetStoreFunction<UserStore>
) {
  const awareness = provider.awareness;
  awareness.on("change", handleAwarenessChange);

  function login(): void {
    awareness.setLocalState({ type: "none", userName: userStore.userName });
  }

  function logout(): void {
    awareness.setLocalState(null);
  }

  function dispatch(action: AwarenessAction): void {
    setUserStore("userName", userStore.userName);
    awareness.setLocalState({ ...action, userName: userStore.userName });
  }

  function handleAwarenessChange(_changes: unknown) {
    const states = Object.fromEntries(awareness.getStates()) as AwarenessStates;
    // console.log("receive awareness", states);

    const otherUserList: string[] = [];
    Object.entries(states).forEach(([clientID, state]) => {
      if (clientID !== String(awareness.clientID)) {
        otherUserList.push(state.userName);
        switch (state.type) {
          case "inputNode":
            updateInputNode(state.userName, state.nodeId, state.text);
            break;
          case "moveNode":
            updateMoveNode(state.userName, state.nodeId, state.x, state.y);
            break;
          case "addEdge":
            updateAddEdgeNode(state.userName, state.nodeId);
            break;
          case "unlockNode":
            unlockNode(state.nodeId);
            break;
        }
      }
    });
    setUserStore("otherUserList", otherUserList);
  }

  function updateInputNode(userName: string, nodeId: NodeId, text: string) {
    setGraphStore(
      "nodeList",
      (node) => node.id === nodeId,
      (node) => ({ ...node, lockTitle: `${userName} inputting`, text })
    );
  }

  function updateMoveNode(
    userName: string,
    nodeId: NodeId,
    x: number,
    y: number
  ) {
    setGraphStore(
      "nodeList",
      (node) => node.id === nodeId,
      (node) => ({ ...node, lockTitle: `${userName} moving`, x, y })
    );
  }

  function updateAddEdgeNode(userName: string, nodeId: NodeId) {
    setGraphStore(
      "nodeList",
      (node) => node.id === nodeId,
      (node) => ({ ...node, lockTitle: `${userName} adding edge` })
    );
  }

  function unlockNode(nodeId: NodeId) {
    setGraphStore(
      "nodeList",
      (node) => node.id === nodeId,
      (node) => ({ ...node, lockTitle: undefined })
    );
  }

  return { dispatch, login, logout };
}
