import { z } from "zod";

const create = z.object({
  ticker: z.string().min(2).max(100),
});

const get = z.object({
  asset_id: z.string().uuid(),
});

export const assetDto = {
  create,
  get,
};
