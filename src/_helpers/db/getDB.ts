import { IDBClass } from "./IDB";

export const getDB = <Adapter extends IDBClass>(adapter: Adapter) => {
  if (!(adapter instanceof IDBClass)) {
    throw new Error("Adapter DB wrong");
  }

  return adapter;
};
