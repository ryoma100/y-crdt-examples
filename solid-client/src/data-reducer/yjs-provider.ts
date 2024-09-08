import { SetStoreFunction } from "solid-js/store";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { Graph, GraphEdge, GraphNode } from "../data-model/data-type";
import { bindYjsToStore } from "../yjs-solidjs/yjs-solidjs";

export function makeYjsProvider(setStore: SetStoreFunction<Graph>) {
  const yDoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "ws://localhost:1234",
    "graph-example.room-1",
    yDoc
  );

  const yRoot = yDoc.getMap("graph-example.v1");
  yRoot.set("nodeList", new Y.Array<Y.Map<GraphNode>>());
  yRoot.set("edgeList", new Y.Array<Y.Map<GraphEdge>>());
  bindYjsToStore(yRoot, setStore);

  return {
    provider,
    yRoot,
  };
}
