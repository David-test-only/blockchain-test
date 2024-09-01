import type Decimal from "decimal.js";

export type TDEX = {
  connect(blockchainAdapter: unknown, owner: unknown): Promise<unknown>;
  getInstance(): unknown;

  getTokenPrice(tokenAddress: string): Promise<Decimal>;
  getTokenPriceForClient(tokenAddress: string): Promise<Decimal>; // INFO: token price + commission
  getTokensPriceForClient(
    tokenAddress: string,
    amount: Decimal,
  ): Promise<Decimal>;
  getCommission(tokenAddress: string): Promise<Decimal>;
  swap(fromToken: string, toToken: string, amount: Decimal): Promise<void>;
  buyToken(tokenAddress: string, amount: Decimal): Promise<unknown>;
  sellToken(tokenAddress: string, amount: Decimal): Promise<unknown>;
  getProfit(
    tokenAddress: string,
    amountSol: Decimal,
    amountTokens: Decimal,
  ): Decimal; // INFO: negative or possitive

  startTransaction(): Promise<unknown>; // FIX: Promise<transactionInstance>
  rollbackTransaction(tx: unknown): Promise<unknown>;
  commitTransaction(tx: unknown): Promise<unknown>;
};

export class IDEX implements TDEX {
  connect(blockchainAdapter: unknown, owner: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getInstance(): unknown {
    throw new Error("Method not implemented.");
  }

  getTokenPrice(tokenAddress: string): Promise<Decimal> {
    throw new Error("Method not implemented.");
  }
  getTokenPriceForClient(tokenAddress: string): Promise<Decimal> {
    throw new Error("Method not implemented.");
  }
  getTokensPriceForClient(
    tokenAddress: string,
    amount: Decimal,
  ): Promise<Decimal> {
    throw new Error("Method not implemented.");
  }
  getCommission(tokenAddress: string): Promise<Decimal> {
    throw new Error("Method not implemented.");
  }
  swap(fromToken: string, toToken: string, amount: Decimal): Promise<void> {
    throw new Error("Method not implemented.");
  }
  buyToken(tokenAddress: string, amount: Decimal): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  sellToken(tokenAddress: string, amount: Decimal): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getProfit(
    tokenAddress: string,
    amountSol: Decimal,
    amountTokens: Decimal,
  ): Decimal {
    throw new Error("Method not implemented.");
  }

  startTransaction(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  rollbackTransaction(tx: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  commitTransaction(tx: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
