import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { createDefaultGraph } from "./data-model/data-factory";
import { makeDataModel } from "./data-model/data-model";
import { Graph } from "./data-model/data-type";
import { createYjsReducer } from "./data-model/yjs-reducer";

const [graphStore, setGraphStore] = createStore<Graph>(createDefaultGraph());
const yjsReducer = createYjsReducer(setGraphStore);
const dataModel = makeDataModel(graphStore, yjsReducer.dispatch, setGraphStore);
const contextValue = { dataModel, yjsReducer };

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
