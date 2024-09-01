export interface IDB {
  connect(): Promise<unknown>;
  getPool(): unknown;
  disconnect(): Promise<unknown>;
}

export class IDBClass implements IDB {
  async connect(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getPool(): unknown {
    throw new Error("Method not implemented.");
  }
  async disconnect(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
