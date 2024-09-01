import { Transaction } from "@solana/web3.js";
import type { IBlockchain } from "../_interfaces/IBlockchain";
import type { IDEX } from "../_interfaces/IDEX";
import type { ITradingStrategy } from "../_interfaces/ITradingStrategy";
import { DEX, prisma } from "../../server";
import { transactionService } from "../../transaction/transaction.service";
import { logger } from "../../_utils/logger";
import { clientService } from "../../client/client.service";
import { assetService } from "../../asset/asset.service";
import Decimal from "decimal.js";

export class LongPositionStrategy implements ITradingStrategy {
  private blockchain: IBlockchain;
  private dex: IDEX;

  constructor(blockchain: IBlockchain, dex: IDEX) {
    this.blockchain = blockchain;
    this.dex = dex;
  }

  async openPosition(
    amount: Decimal,
    assetId: string,
    userId: string,
  ): Promise<void> {
    // INFO: 1 variant transaction (only dex)
    const balance = await this.blockchain.getBalance(userId);
    if (amount.gt(balance)) throw new Error("Insufficient balance");
    let tx: unknown;
    try {
      tx = await this.dex.startTransaction();
      const dexTransaction = await this.dex.swap("SOL", assetId, amount);
      this.dex.commitTransaction(tx);
      return dexTransaction;
    } catch (err) {
      // FIX: instance custom Transaction (not only solana)
      // INFO: tx possible undefined if throw in startTransaction
      if (tx instanceof Transaction) {
        this.dex.rollbackTransaction(tx);
        throw new Error("Failed transaction DEX - open position");
      }
    }
  }

  async closePosition(
    amount: Decimal,
    assetId: string,
    userId: string,
  ): Promise<Decimal> {
    // INFO: 2 variant transaction (mix)
    try {
      const user = clientService.get(userId);
      let totalProfit = new Decimal(0);
      prisma.$transaction(async (tx) => {
        // FIX: wrong logic if user close position (openTotal > closePosition)
        const longOpenPositions =
          await transactionService.getDataPosition(/**user.client_id**/);

        // WARNING: or use assetId?
        for (const position of longOpenPositions) {
          const asset = await assetService.get({ asset_id: position.asset_id });

          const profit = DEX.getProfit(
            asset.contract_address,
            position.quote_amount,
            position.amount_token,
          );

          totalProfit.add(profit);

          const subTransaction = await DEX.startTransaction();
          DEX.sellToken(asset.contract_address, new Decimal(amount));
          DEX.commitTransaction(subTransaction);

          // TODO: create methods for fast update
          //
          // clientService.updateBalance();
          // platformService.updateBalance();
          // transactionService.updateBalance();
        }
      });
      return totalProfit;
    } catch (err) {
      logger.error(err);
      throw new Error("Failed transaction");
    }
    console.log("Closing position and updating balances");
    // Продажа токенов и обновление балансов
  }
}
