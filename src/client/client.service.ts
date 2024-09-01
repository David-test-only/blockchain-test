import type { Client } from "@prisma/client/wasm";
import { BLOCKCHAIN, DEX, prisma } from "../server";
import { logger } from "../_utils/logger";
import Decimal from "decimal.js";
import { platformService } from "../platform/platform.service";
import { transactionService } from "../transaction/transaction.service";
import type { TTransactionCreate } from "../transaction/transaction.types";
import { LongPositionStrategy } from "../_tradingPlatform/ITradingStategy/longPositionStrategy";
import type {
  TCLientClosingLongPosition,
  TCLientCreate,
  TCLientGetBalance,
  TCLientOpeningLongPosition,
} from "./client.type";

class ClientService {
  create(client: TCLientCreate): Promise<Client> {
    try {
      return prisma.client.create({
        data: {
          ...client,
          balance_quote: 0,
          balance_tokens: 0,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed create client");
    }
  }
  get(client_id: string) {
    try {
      return prisma.client.findUniqueOrThrow({
        where: {
          client_id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed find client");
    }
  }
  getAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }
  getBalance(client: TCLientGetBalance) {
    try {
      return prisma.client.findUnique({
        where: {
          client_id: client.client_id,
        },
        select: {
          balance_quote: true,
          balance_tokens: true,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed get balance");
    }
  }
  async openingLongPosition(data: TCLientOpeningLongPosition) {
    const amount_token = new Decimal(data.amount_token);
    try {
      const asset = await prisma.asset.findUniqueOrThrow({
        where: {
          asset_id: data.asset_id,
        },
      });
      // FIX: not optimal use DEX.getTokenPrice() and DEX.getCommission() - now 5 Request / after refactoring 2 Request;
      const tokenPrice = await DEX.getTokenPrice(asset.contract_address);
      const tokenPriceForClient = await DEX.getTokenPriceForClient(
        asset.contract_address,
      );
      const tokensPriceForClient = await DEX.getTokensPriceForClient(
        asset.contract_address,
        amount_token,
      );
      // FIX: not optimal end
      return prisma.$transaction(async (tx) => {
        // const priceForAllTokens = new Decimal(tokenPrice).mul(amount_token);

        const client = await tx.client.update({
          data: {
            balance_quote: {
              decrement: tokensPriceForClient,
            },
          },
          where: {
            client_id: data.user_id,
          },
        });

        if (client.balance_quote.lessThan(0)) {
          throw new Error(
            `There are not enough funds on your balance to purchase ${amount_token} ${asset.ticker} with a total cost of ${tokensPriceForClient}`,
          );
        }

        const longPositionStrategy = new LongPositionStrategy(BLOCKCHAIN, DEX);

        const dexTransaction = longPositionStrategy.openPosition(
          amount_token,
          data.asset_id,
          data.user_id,
        );
        const beforePlatform = await platformService.get({ balance_id: "1" });
        // FIX: wery wery bad change type Decimal from Number and const balance_id
        // INFO: acceleration of test task
        const afterPlatform = await platformService.updateBalance({
          balance_id: "1",
          balance_sol: Number(tokensPriceForClient),
          balance_tokens: Number(amount_token),
        });

        const transactionConfig: TTransactionCreate = {
          user_id: data.user_id,
          // tokenPrice,
          // tokenPriceForClient,
          // beforePlatform,
          // afterPlatform,
          // other params,
        };
        transactionService.create(transactionConfig);

        // INFO: automatic commit transaction or rollback if throw
        return client;
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed transaction opening long position");
    }
  }

  async closeLongPosition(data: TCLientClosingLongPosition): Promise<Decimal> {
    const longPositionStrategy = new LongPositionStrategy(BLOCKCHAIN, DEX);

    // return total profit
    return await longPositionStrategy.closePosition(
      new Decimal(data.amount_token),
      data.asset_id,
      data.user_id,
    );
  }
}

export const clientService = new ClientService();
