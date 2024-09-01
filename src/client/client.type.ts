import { z } from "zod";
import type { clientDto } from "./client.dto";

export type TCLientCreate = z.infer<typeof clientDto.create>;
export type TCLientGetBalance = z.infer<typeof clientDto.getBalance>;
export type TCLientOpeningLongPosition = z.infer<
  typeof clientDto.openingLongPosition
>;
export type TCLientClosingLongPosition = z.infer<
  typeof clientDto.closingLongPosition
>;
