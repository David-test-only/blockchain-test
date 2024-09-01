import {
  Connection,
  clusterApiUrl,
  Keypair,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

import { IBlockchain } from "../_interfaces/IBlockchain";

export class SolanaAdapter extends IBlockchain {
  private account: Keypair;
  private connection: Connection;
  private wallet: Keypair;

  constructor() {
    super();
    // FIX: account fake
    this.account = Keypair.generate();
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    this.wallet = Keypair.fromSecretKey(this.account.secretKey);
  }

  getAccount(): Keypair {
    return this.account;
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Keypair {
    return this.wallet;
  }

  async sendTransaction(transaction: Transaction): Promise<string> {
    const signature = await this.connection.sendTransaction(transaction, [
      Keypair.generate(),
    ]);
    return signature;
  }

  async getBalance(address: string): Promise<number> {
    return await this.connection.getBalance(this.account.publicKey);
  }
}
