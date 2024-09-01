import { z } from "zod";

/**
 * FIX: real check for create
 *
   user_id: UUID,
   asset_id: UUID,
   transaction_type: (ENUM: 'open_position', 'close_position')
   position_type: (ENUM: 'long', 'short'),
   amount_token: Decimal,
   quote_amount: Decimal,
   status: (ENUM: 'pending', 'successful', 'failed'),
   dex_transaction_id: string(?, ?)
   platform_balance_before: Decimal,
   platform_balance_after: Decimal,
**/
const create = z.object({
  user_id: z.string().uuid(),
});

const getById = z.object({
  transaction_id: z.string().uuid(),
});

export const transactionDto = {
  create,
  getById,
};
