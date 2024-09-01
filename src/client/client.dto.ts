import { z } from "zod";

const create = z.object({
  name: z.string().min(2).max(100),
});

const getBalance = z.object({
  client_id: z.string().uuid(),
});

const openingLongPosition = z.object({
  amount_token: z.number(),
  asset_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

const closingLongPosition = z.object({
  amount_token: z.number(),
  asset_id: z.string().uuid(),
  user_id: z.string().uuid(),
});

export const clientDto = {
  create,
  getBalance,
  openingLongPosition,
  closingLongPosition,
};
