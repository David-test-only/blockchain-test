import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { middlewareValidation } from "../_helpers/middleware/controller/validation";
import { middlewareAuth } from "../_helpers/middleware/auth";
import { E_HTTP_STATUS_CODE } from "../_helpers/enum/httpStatusCode";
import { transactionDto } from "./transaction.dto";
import { transactionService } from "./transaction.service";

const router = Router();

const middleware = {
  auth: middlewareAuth,

  validationGetById: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(transactionDto, "getById", req, res, next),
};

/**
 * Get - transaction
 * Method: POST
 * Required: {transaction_id: UUID}
 * Middleware: [auth, validationGetBalance]
 *
 * Response Transaction {
 *  transaction_id: UUID,
 *  user_id: UUID,
 *  asset_id: UUID,
 *  transaction_type: (ENUM: 'open_position', 'close_position')
 *  position_type: (ENUM: 'long', 'short'),
 *  amount_token: Decimal,
 *  quote_amount: Decimal,
 *  status: (ENUM: 'pending', 'successful', 'failed'),
 *  date: TIMESTAMP,
 *  dex_transaction_id: string(?, ?)
 *  platform_balance_before: Decimal,
 *  platform_balance_after: Decimal,
 * }
 */
router.post(
  "/get-by-id", // getById, getBy[many optional fields]
  [middleware.auth, middleware.validationGetById],
  async (req: Request, res: Response) => {
    const transaction = await transactionService.getById(req.body);
    res.status(E_HTTP_STATUS_CODE.success).json(transaction);
  },
);

export const platformRoute = router;
