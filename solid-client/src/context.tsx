import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { makeDataModel } from "./data-model/data-model";

const dataModel = makeDataModel();

export const GraphContext = createContext(dataModel);

export function GraphProvider(props: { readonly children: JSX.Element }) {
  return (
    <GraphContext.Provider value={dataModel}>
      {props.children}
    </GraphContext.Provider>
  );
}

export function useGraphContext() {
  return useContext(GraphContext);
}
