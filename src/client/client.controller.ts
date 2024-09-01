import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { clientDto } from "./client.dto";
import { clientService } from "./client.service";
import { E_HTTP_STATUS_CODE } from "../_helpers/enum/httpStatusCode";
import { middlewareValidation } from "../_helpers/middleware/controller/validation";
import { middlewareAuth } from "../_helpers/middleware/auth";

const router = Router();

const middleware = {
  auth: middlewareAuth,

  validationCreateClient: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(clientDto, "create", req, res, next),

  validationGetBalance: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(clientDto, "getBalance", req, res, next),

  validationOpeningLongPosition: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => middlewareValidation(clientDto, "openingLongPosition", req, res, next),

  validationClosingLongPosition: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => middlewareValidation(clientDto, "closingLongPosition", req, res, next),
};

/**
 * Create - client
 * Method: POST
 * Required {name: string(2, 100)}
 * Middleware: [validationCreateClient]
 *
 * Response: Client {client_id: UUID, name: string(2, 100), balance_quote: Decimal, balance_tokens: Decimal}
 */
router.post("/", middleware.validationCreateClient, async (req, res) => {
  const client = await clientService.create(req.body);
  res.status(E_HTTP_STATUS_CODE.created).json(client);
});

/**
 * Get all clients
 * Method: GET
 * Optional: {limit: PositiveNumberWithoutZero, offset: PositiveNumber}  INFO: not implemented
 * MiddlewareOptional: [auth]
 *
 * Response: Client[]
 */
router.get("/all", async (req, res) => {
  const clients = await clientService.getAll();
  res.json(clients);
});

//INFO: for some reason we don't want to show client_id, and we are also worried that the browser will cache ?client_id=""
//INFO: if we still need to use get, we can do it like this const client_id = decodingMethod(req.headers['client-id']);
/**
 * Get Balance - client
 * Method: POST
 * Required: {client_id: UUID}
 * Middleware: [auth, validationGetBalance]
 *
 * Response: {balance_quote: Decimal, balance_tokens: Decimal}
 */
router.post(
  "/get-balance",
  [middleware.auth, middleware.validationGetBalance],
  async (req: Request, res: Response) => {
    const balance = await clientService.getBalance(req.body.client_id);
    res.status(E_HTTP_STATUS_CODE.success).json(balance);
  },
);

/**
 * Opening long position - client
 * Method: POST
 * Required: {amount_token: Decimal, asset_id: UUID, user_id: UUID}
 * Middleware: [auth, validationOpeningLongPosition]
 * 
 * Inputs:
    amount_token (DECIMAL): Amount of tokens to purchase.
    asset_id (UUID): Identifier of the asset.
    user_id (UUID): Identifier of the user.
    
  TODO: Response: boolean | Error
 */
router.post(
  "/opening-long-position",
  [middleware.auth, middleware.validationOpeningLongPosition],
  async (req: Request, res: Response) => {
    // FIX: this code broken - fake methods
    const _ = await clientService.openingLongPosition(req.body);

    return res
      .status(E_HTTP_STATUS_CODE.success)
      .json({ message: "opening-long-position" });
  },
);

router.post(
  "/closing-long-position",
  [middleware.auth, middleware.validationClosingLongPosition],
  async (req: Request, res: Response) => {
    // FIX: this code broken - fake methods
    const data = await clientService.closeLongPosition(req.body);

    return res.status(E_HTTP_STATUS_CODE.success).json({ totalProfit: data });
  },
);

export const clientRoute = router;
