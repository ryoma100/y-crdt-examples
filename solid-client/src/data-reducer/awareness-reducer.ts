import { produce, SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";

import { GraphStore, NodeId, UserStore } from "../data-model/data-type";

export type AwarenessAction =
  | { type: "none" }
  | { type: "inputNode"; nodeId: NodeId; text: string }
  | { type: "moveNode"; nodeId: NodeId; x: number; y: number }
  | { type: "addEdge"; nodeId: NodeId };

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
    const otherStateMap: Record<
      /* nodeId */ string,
      AwarenessState | undefined
    > = {};
    Object.entries(states).forEach(([clientID, state]) => {
      if (clientID !== String(awareness.clientID)) {
        otherUserList.push(state.userName);
        if (state.type !== "none") {
          otherStateMap[state.nodeId] = state;
        }
      }
    });
    setUserStore("otherUserList", otherUserList);

    setGraphStore(
      "nodeList",
      produce((nodeList) => {
        for (const node of nodeList) {
          const state = otherStateMap[node.id];
          switch (state?.type) {
            case "inputNode":
              node._lockTitle = `${state.userName} inputting`;
              node.text = state.text;
              break;
            case "moveNode":
              node._lockTitle = `${state.userName} moving`;
              node.x = state.x;
              node.y = state.y;
              break;
            case "addEdge":
              node._lockTitle = `${state.userName} adding edge`;
              break;
            default:
              if (node._lockTitle) {
                node._lockTitle = undefined;
              }
              break;
          }
        }
      })
    );
  }

  return { dispatch, login, logout };
}
