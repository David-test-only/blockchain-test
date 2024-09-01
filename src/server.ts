import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "./_utils/logger";
import helmet from "helmet";
import compression from "compression";
import { E_HTTP_STATUS_CODE } from "./_helpers/enum/httpStatusCode";
import { E_ERROR_MESSAGE } from "./_helpers/enum/errorMessage";
import { PrismaAdapter } from "./_helpers/db/prisma.adapter";
import { getDB } from "./_helpers/db/getDB";
import { clientRoute } from "./client/client.controller";
import { assetRoute } from "./asset/asset.controller";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { SolanaAdapter } from "./_tradingPlatform/IBlockchain/solana.adapter";
import { Raydium } from "@raydium-io/raydium-sdk-v2";
import { getPrice } from "./_helpers/axios/raydium";
import { getDex } from "./_tradingPlatform/IDEX/dex";
import { RaydiumAdapter } from "./_tradingPlatform/IDEX/raydium.adapter";
import type { IBlockchain } from "./_tradingPlatform/_interfaces/IBlockchain";
import { getBlockchain } from "./_tradingPlatform/IBlockchain/blockchain";
import type { IDEX } from "./_tradingPlatform/_interfaces/IDEX";

const app: Express = express();

const db = getDB(new PrismaAdapter());
// FIX: to simplify the test task, but on production we should use only (const db)
export const prisma: PrismaClient = db.getPool();

export const BLOCKCHAIN: IBlockchain = getBlockchain(new SolanaAdapter());
export const DEX: IDEX = getDex(new RaydiumAdapter());

// bun handles .env itself so we don't need dotenv
const _PORT = process.env.PORT || 8080;

async function main() {
  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  // region:      --- routes
  app.use("/api/client", clientRoute);
  app.use("/api/asset", assetRoute);

  // FIX: REMOVE BEFORE PROD
  app.get("/__fake", async (req, res) => {
    const solana = new SolanaAdapter();
    let owner = Keypair.generate();
    const raydium = await Raydium.load({
      connection: solana.getConnection(),
      owner,
    });

    // const data = await getPrice("So11111111111111111111111111111111111111112");

    const data = await raydium.api.fetchPoolByMints({
      mint1: "So11111111111111111111111111111111111111112",
    });
    res.status(200).json(data);
  });
  // FIX: REMOVE BEFORE PROD END

  // 404 handler
  app.all("*", _handlerNotFound);

  // throw new Error handler
  app.use(_handlerServerError);
  // endregion:   --- routes

  app.listen(_PORT, () => {
    logger.info(`Server started: ${_PORT}`);
  });
}

function _handlerNotFound(req: Request, res: Response) {
  res
    .status(E_HTTP_STATUS_CODE.notFound)
    .json({ message: E_ERROR_MESSAGE.notFound });
}

function _handlerServerError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.stack);
  res
    .status(E_HTTP_STATUS_CODE.serverError)
    .json({ message: E_ERROR_MESSAGE.serverError });
}

main()
  .then(async () => {
    await db.connect();
  })
  .catch(async (err: Error) => {
    logger.error(err);
    await db.disconnect();
    process.exit();
  });
