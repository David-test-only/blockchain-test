import type Decimal from "decimal.js";

export interface ITradingStrategy {
  openPosition(amount: Decimal, assetId: string, userId: string): Promise<void>;
  closePosition(
    amount: Decimal,
    assetId: string,
    userId: string,
  ): Promise<Decimal>;
}
