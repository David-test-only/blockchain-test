import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { E_HTTP_STATUS_CODE } from "../_helpers/enum/httpStatusCode";
import { middlewareValidation } from "../_helpers/middleware/controller/validation";
import { assetDto } from "./asset.dto";
import { assetService } from "./asset.service";
import { middlewareAuth } from "../_helpers/middleware/auth";

const router = Router();

const middleware = {
  auth: middlewareAuth,

  validationCreateAsset: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(assetDto, "create", req, res, next),

  validationGetAll: (req: Request, res: Response, next: NextFunction) =>
    middlewareValidation(assetDto, "create", req, res, next),
};

/**
 * Create - asset
 * Method: POST
 * Required: {ticker: string(2, 100)}
 * Middleware: [validationCreateAsset]
 *
 * Response: Asset { asset_id: UUID, ticker: string(?, ?), contract_address: string }
 */
router.post("/", middleware.validationCreateAsset, async (req, res) => {
  const asset = await assetService.create(req.body);
  res.status(E_HTTP_STATUS_CODE.created).json(asset);
});

/**
 * Get all - assets
 * Method: POST
 * Optional: {limit: PositiveNumberWithoutZero, offset: PositiveNumber}  INFO: not implemented
 * MiddlewareOptional: [auth]
 *
 * Response: Asset[]
 */
router.get("/all", async (req, res) => {
  const asserts = await assetService.getAll();
  res.json(asserts);
});

export const assetRoute = router;
