import { IDEX } from "../_interfaces/IDEX";

export const getDex = <Adapter extends IDEX>(adapter: Adapter) => {
  if (!(adapter instanceof IDEX)) {
    throw new Error("Adapter DEX wrong");
  }

  return adapter;
};
