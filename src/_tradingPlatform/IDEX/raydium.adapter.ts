import { Keypair } from "@solana/web3.js";
import { IDEX } from "../_interfaces/IDEX";
import { Raydium } from "@raydium-io/raydium-sdk-v2";
import type { IBlockchain } from "../_interfaces/IBlockchain";
import type Decimal from "decimal.js";

export class RaydiumAdapter extends IDEX {
  private instance: Raydium | null = null;

  async connect(blockchainAdapter: IBlockchain, owner: Keypair) {
    this.instance = await Raydium.load({
      connection: blockchainAdapter.getConnection(),
      owner,
    });

    return this.instance;
  }

  getInstance() {
    return this.instance;
  }

  async swap(
    fromToken: string,
    toToken: string,
    amount: Decimal,
  ): Promise<void> {
    console.log(`Swapping ${amount} ${fromToken} to ${toToken} on Raydium`);
  }
}
