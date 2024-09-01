import type { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";
import { E_HTTP_STATUS_CODE } from "../../enum/httpStatusCode";

type TDtoObject = { [key: string]: ZodSchema<any> };
type TDtoAction<T extends TDtoObject> = keyof T;

export const middlewareValidation = async <T extends TDtoObject>(
  dto: T,
  action: TDtoAction<T>,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validation = dto[action].safeParse(req.body);

  if (!validation.success) {
    return res
      .status(E_HTTP_STATUS_CODE.badRequest)
      .json({ message: validation.error.errors });
  }

  next();
};
