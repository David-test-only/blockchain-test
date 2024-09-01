import { IBlockchain } from "../_interfaces/IBlockchain";

export const getBlockchain = <Adapter extends IBlockchain>(
  adapter: Adapter,
) => {
  if (!(adapter instanceof IBlockchain)) {
    throw new Error("Adapter Blockchain wrong");
  }

  return adapter;
};
