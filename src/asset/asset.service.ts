import type { Asset } from "@prisma/client/wasm";
import { prisma } from "../server";
import { logger } from "../_utils/logger";
import { randomBytes } from "crypto";
import type { TAssetCreate, TAssetGet } from "./asset.type";

class AssetService {
  create(asset: TAssetCreate): Promise<Asset> {
    try {
      return prisma.asset.create({
        data: {
          ...asset,
          contract_address: "So11111111111111111111111111111111111111112", // randomBytes(8).toString("hex"), // FIX: fake
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed create asset");
    }
  }
  get(asset: TAssetGet) {
    try {
      return prisma.asset.findUniqueOrThrow({
        where: {
          asset_id: asset.asset_id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed find asset");
    }
  }
  getAll(): Promise<Asset[]> {
    return prisma.asset.findMany();
  }
}

export const assetService = new AssetService();
