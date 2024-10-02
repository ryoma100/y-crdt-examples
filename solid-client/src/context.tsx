import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { makeDataModel } from "./data-model/data-model";
import { makeDataStore } from "./data-store/data-store";
import { makeAwarenessReducer } from "./data-yjs/awareness-reducer";
import { makeYjsProvider } from "./data-yjs/yjs-provider";
import { makeYjsReducer } from "./data-yjs/yjs-reducer";

const dataStore = makeDataStore();
const yjsProvider = makeYjsProvider(dataStore.setGraphStore);
const yjsReducer = makeYjsReducer(yjsProvider.yRoot);
const awarenessReducer = makeAwarenessReducer(
  yjsProvider.provider,
  dataStore.userStore,
  dataStore.setGraphStore,
  dataStore.setUserStore
);
awarenessReducer.login();
const dataModel = makeDataModel(
  dataStore.graphStore,
  yjsReducer.dispatch,
  awarenessReducer.dispatch,
  dataStore.setGraphStore
);
const contextValue = {
  dataModel,
  dataStore,
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
