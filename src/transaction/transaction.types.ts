import { z } from "zod";
import type { transactionDto } from "./transaction.dto";

export type TTransactionCreate = z.infer<typeof transactionDto.create>;
export type TTransactionGetById = z.infer<typeof transactionDto.getById>;
