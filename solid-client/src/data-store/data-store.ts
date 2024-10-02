import { createStore } from "solid-js/store";
import { createDefaultGraph, createDefaultUser } from "./data-factory";
import { GraphStore, UserStore } from "./data-type";

export type DataStore = ReturnType<typeof makeDataStore>;

export function makeDataStore() {
  const [graphStore, setGraphStore] = createStore<GraphStore>(
    createDefaultGraph()
  );
  const [userStore, setUserStore] = createStore<UserStore>(createDefaultUser());

  return { graphStore, setGraphStore, userStore, setUserStore };
}
