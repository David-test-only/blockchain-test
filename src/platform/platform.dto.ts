import { z } from "zod";

const create = z.object({
  balance_tokens: z.number(),
  balance_sol: z.number(),
});

const getBalance = z.object({
  balance_id: z.string().uuid(),
});

const update = z.object({
  balance_id: z.string(),
  balance_tokens: z.number().optional(),
  balance_sol: z.number().optional(),
  last_updated: z.date(),
});

const updateBalance = z.object({
  balance_id: z.string(),
  balance_tokens: z.number(),
  balance_sol: z.number(),
});

export const platformDto = {
  create,
  getBalance,
  update,
  updateBalance,
};
