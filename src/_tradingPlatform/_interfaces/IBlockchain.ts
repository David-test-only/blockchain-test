import type { Connection, PublicKey, Transaction } from "@solana/web3.js";

type TConnection = Connection; // or or or
type TTransaction = Transaction;

export type TBlockchain = {
  getConnection(): TConnection;
  getAccount(): unknown;
  sendTransaction(transaction: TTransaction): Promise<string>;
  getBalance(address: string): Promise<number>;
};

export class IBlockchain implements TBlockchain {
  getConnection(): TConnection {
    throw new Error("Method not implemented.");
  }
  getAccount(): unknown {
    throw new Error("Method not implemented.");
  }
  sendTransaction(transaction: TTransaction): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getBalance(address: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
