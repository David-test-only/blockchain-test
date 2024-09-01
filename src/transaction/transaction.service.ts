import { prisma } from "../server";
import { logger } from "../_utils/logger";
import type {
  TTransactionCreate,
  TTransactionGetById,
} from "./transaction.types";
import type { Transaction } from "@prisma/client";

class TransactionService {
  create(transaction: TTransactionCreate) {
    // FIX: fake data;
    return { transaction_id: 1 };
  }
  async getDataPosition() {
    const [longOpenPosition, longOpenPositionTotal] = await prisma.$transaction(
      [
        prisma.transaction.findMany({
          where: { position_type: "long", transaction_type: "open_position" },
        }),
        prisma.transaction.count(),
      ],
    );

    const [longClosePosition, longClosePositionTotal] =
      await prisma.$transaction([
        prisma.transaction.findMany({
          where: { position_type: "long", transaction_type: "close_position" },
        }),
        prisma.transaction.count(),
      ]);

    if (longOpenPositionTotal < longClosePositionTotal) {
      throw new Error("Open positions are greater than closed ones");
    }

    return longOpenPosition;
  }
  getById(transaction: TTransactionGetById): Promise<Transaction> {
    try {
      return prisma.transaction.findUniqueOrThrow({
        where: {
          transaction_id: transaction.transaction_id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed find transaction");
    }
  }
}

export const transactionService = new TransactionService();
