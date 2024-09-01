import type { PlatformBalance } from "@prisma/client/wasm";
import { prisma } from "../server";
import { logger } from "../_utils/logger";
import { randomBytes } from "crypto";
import type {
  TPlatformCreate,
  TPlatformGet,
  TPlatformUpdate,
  TPlatformUpdateBalance,
} from "./platform.type";

class PlatformService {
  create(platform: TPlatformCreate): Promise<PlatformBalance> {
    try {
      return prisma.platformBalance.create({
        data: {
          ...platform,
          last_updated: new Date(),
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed create platform");
    }
  }

  get(platform: TPlatformGet) {
    try {
      return prisma.platformBalance.findUniqueOrThrow({
        where: {
          balance_id: platform.balance_id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed find platform");
    }
  }

  update(platform: TPlatformUpdate) {}

  updateBalance(platform: TPlatformUpdateBalance): Promise<PlatformBalance> {
    try {
      return prisma.platformBalance.update({
        where: {
          balance_id: platform.balance_id,
        },
        data: {
          balance_sol: platform.balance_sol,
          balance_tokens: platform.balance_tokens,
          last_updated: new Date(),
        },
      });
    } catch (err) {
      logger.error(err);
      throw new Error("Failed update balance platform");
    }
  }
}

export const platformService = new PlatformService();
