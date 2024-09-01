import { Prisma, PrismaClient } from "@prisma/client";
import { IDBClass, type IDB } from "./IDB";

export class PrismaAdapter extends IDBClass {
  private db: PrismaClient;

  constructor() {
    super();
    this.db = new PrismaClient({
      transactionOptions: {
        // uses the database config, so it's better to use it
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // postgres default - ReadCommitted
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    });
  }

  async connect(): Promise<unknown> {
    return this.db.$connect;
  }

  getPool(): PrismaClient {
    return this.db;
  }
  async disconnect(): Promise<unknown> {
    return this.db.$disconnect();
  }
}
