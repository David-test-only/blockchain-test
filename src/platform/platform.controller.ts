import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { E_HTTP_STATUS_CODE } from "../_helpers/enum/httpStatusCode";
import { middlewareValidation } from "../_helpers/middleware/controller/validation";
import { middlewareAuth } from "../_helpers/middleware/auth";
import { platformDto } from "./platform.dto";
import { platformService } from "./platform.service";

const router = Router();

const middleware = {
  auth: middlewareAuth,

  validationCreatePlatform: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(platformDto, "create", req, res, next),

  validationGetBalance: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(platformDto, "getBalance", req, res, next),
};

/**
 * Create - platform
 * Method: POST
 * Required: {balance_tokens: Decimal, balance_sol: Decimal}
 * Middleware: [validationCreatePlatform]
 * MiddlewareOptional: [auth, role(if there is a division of responsibility)] - FIX: in production all routes except authorization, registration, refresh token and logout should be under the autn middleware
 *
 * Response: Platform {balance_id: UUID, balance_tokens: Decimal, balance_sol: Decimal, last_updated: TIMESTAMP}
 */
router.post("/", middleware.validationCreatePlatform, async (req, res) => {
  const platform = await platformService.create(req.body);
  res.status(E_HTTP_STATUS_CODE.created).json(platform);
});

/**
 * Get balance - platform
 * Method: POST
 * Required: {balance_id: UUID}
 * Middleware: [auth, validationGetBalance]
 *
 * Response: {balance_tokens: Decimal, balance_sol: Decimal}
 */
router.post(
  "/balance",
  [middleware.auth, middleware.validationGetBalance],
  async (req: Request, res: Response) => {
    const platformBalance = await platformService.get(req.body);
    res.status(E_HTTP_STATUS_CODE.success).json(platformBalance);
  },
);

export const platformRoute = router;
