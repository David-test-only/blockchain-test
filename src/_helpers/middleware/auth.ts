import type { NextFunction, Request, Response } from "express";
import { E_HTTP_STATUS_CODE } from "../enum/httpStatusCode";
import { E_ERROR_MESSAGE } from "../enum/errorMessage";

// FIX: primitive (don't use in prod)
export const middlewareAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  //TODO: need check token
  if (!authHeader) {
    return res
      .status(E_HTTP_STATUS_CODE.unauthorized)
      .json({ message: E_ERROR_MESSAGE.unauthorized });
  }

  next();
};
