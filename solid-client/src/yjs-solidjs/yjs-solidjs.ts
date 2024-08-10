/* eslint-disable @typescript-eslint/no-explicit-any */
import deepEqual from "fast-deep-equal";
import { SetStoreFunction, produce } from "solid-js/store";
import * as Y from "yjs";

export function bindYjsToStore<T>(
  yRoot: Y.Map<any>,
  setStore: SetStoreFunction<T>
): () => void {
  const observer = (events: Y.YEvent<any>[]) => {
    console.debug("receive events", events);

    setStore(
      produce((sRoot) => {
        events.forEach((event) => {
          const parent = searchChangeParent(sRoot, yRoot, event.path);

          if (parent.y instanceof Y.Map) {
            event.changes.keys.forEach((item, key) => {
              if (item.action === "delete") {
                delete parent.s[key];
                // reconcile?
              } else {
                const yValue = parent.y.get(key) as Y.AbstractType<T>;
                insertYValueToS(yValue, parent.s, key);
              }
            });
          } else if (parent.y instanceof Y.Array) {
            if (deepEqual(parent.s, toJSON(parent.y))) {
              return;
            }

            let retain = 0;
            event.changes.delta.forEach((item) => {
              if (item.retain) {
                retain += item.retain;
              }
              if (item.delete) {
                parent.s.splice(retain, item.delete);
              }
              if (item.insert) {
                if (Array.isArray(item.insert)) {
                  item.insert.forEach((yv, i) => {
                    insertYValueToS(yv, parent.s, retain + i);
                  });
                } else {
                  insertYValueToS(item.insert as any, parent.s, retain);
                }
                retain += item.insert.length;
              }
            });
          }
        });
      })
    );
  };

  yRoot.observeDeep(observer);
  return () => {
    yRoot.unobserveDeep(observer);
  };
}

function insertYValueToS<T>(
  yValue: Y.AbstractType<T>,
  sValue: any,
  keyOrIndex: number | string
) {
  switch (typeof keyOrIndex) {
    case "string":
      sValue[keyOrIndex] = toJSON(yValue);
      break;
    case "number":
      sValue.splice(keyOrIndex, 0, toJSON(yValue));
      break;
  }
}

function searchChangeParent<T>(
  sRoot: T,
  yRoot: Y.Map<T> | Y.Array<T>,
  path: (string | number)[]
) {
  let s: any = sRoot;
  let y: any = yRoot;
  for (let i = 0; s !== undefined && i < path.length; i += 1) {
    const keyOrIndex = path[i];
    switch (typeof keyOrIndex) {
      case "string":
        s = s[keyOrIndex];
        y = y.get(keyOrIndex);
        break;
      case "number":
        s = s[keyOrIndex];
        y = y.get(keyOrIndex);
        break;
    }
  }
  return { s, y };
}

type Value = string | number | boolean;
type Dict = {
  [index: string]: null | Value | Value[] | Dict[];
};

export function convertYMap<T extends Dict>(
  obj: T,
  yMap: Y.Map<T> = new Y.Map<T>()
): Y.Map<T> {
  Object.entries(obj).forEach(([key, value]) => {
    const yValue = toYjsValue(value);
    if (yValue !== undefined && yMap.get(key) !== yValue) {
      yMap.set(key, yValue);
    }
  });
  return yMap;
}

export function convertYArray<T extends Dict[]>(
  arr: T,
  yArray = new Y.Array<T>()
): Y.Array<T> {
  yArray.insert(
    0,
    arr.map(toYjsValue).filter((item) => item != undefined)
  );
  return yArray;
}

function toYjsValue(value: any): any {
  if (Array.isArray(value)) {
    return convertYArray(value);
  }

  if (typeof value === "object") {
    return convertYMap(value);
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return undefined;
}

function toJSON(yv: unknown) {
  if (yv instanceof Y.AbstractType) {
    return yv.toJSON();
  }
  return yv;
}
