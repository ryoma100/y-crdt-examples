import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { createDefaultGraph } from "./data-model/data-factory";
import { makeDataModel } from "./data-model/data-model";
import { Graph } from "./data-model/data-type";
import { makeAwarenessReducer } from "./data-reducer/awareness-reducer";
import { makeYjsProvider } from "./data-reducer/yjs-provider";
import { makeYjsReducer } from "./data-reducer/yjs-reducer";

const [graphStore, setGraphStore] = createStore<Graph>(createDefaultGraph());

const yjsProvider = makeYjsProvider(setGraphStore);
const yjsReducer = makeYjsReducer(yjsProvider.yRoot);
const awarenessReducer = makeAwarenessReducer(
  yjsProvider.provider,
  setGraphStore
);
const dataModel = makeDataModel(
  graphStore,
  yjsReducer.dispatch,
  awarenessReducer.dispatch,
  setGraphStore
);
const contextValue = {
  dataModel,
  yjsProvider,
  yjsDispatch: yjsReducer.dispatch,
  awarenessDispatch: awarenessReducer.dispatch,
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
