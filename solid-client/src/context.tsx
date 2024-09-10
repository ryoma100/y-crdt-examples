import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import {
  createDefaultGraph,
  createDefaultUser,
} from "./data-model/data-factory";
import { makeDataModel } from "./data-model/data-model";
import { GraphStore, UserStore } from "./data-model/data-type";
import { makeAwarenessReducer } from "./data-reducer/awareness-reducer";
import { makeYjsProvider } from "./data-reducer/yjs-provider";
import { makeYjsReducer } from "./data-reducer/yjs-reducer";

const [graphStore, setGraphStore] = createStore<GraphStore>(
  createDefaultGraph()
);
const [userStore, setUserStore] = createStore<UserStore>(createDefaultUser());

const yjsProvider = makeYjsProvider(setGraphStore);
const yjsReducer = makeYjsReducer(yjsProvider.yRoot);
const awarenessReducer = makeAwarenessReducer(
  yjsProvider.provider,
  userStore,
  setGraphStore,
  setUserStore
);
awarenessReducer.login();
const dataModel = makeDataModel(
  graphStore,
  yjsReducer.dispatch,
  awarenessReducer.dispatch,
  setGraphStore
);
const contextValue = {
  dataModel,
  userStore,
  setUserStore,
  yjsDispatch: yjsReducer.dispatch,
  awarenessDispatch: awarenessReducer.dispatch,
  connect: () => {
    yjsProvider.provider.connect();
  },
  disconnect: () => {
    yjsProvider.provider.disconnect();
  },
  logout: () => {
    awarenessReducer.logout();
    yjsProvider.provider.disconnect();
  },
};

export const GraphContext = createContext(contextValue);

export function GraphProvider(props: { readonly children: JSX.Element }) {
  return (
    <GraphContext.Provider value={contextValue}>
      {props.children}
    </GraphContext.Provider>
  );
}

export function useGraphContext() {
  return useContext(GraphContext);
}
