import { z } from "zod";
import type { platformDto } from "./platform.dto";

export type TPlatformCreate = z.infer<typeof platformDto.create>;
export type TPlatformGet = z.infer<typeof platformDto.getBalance>;
export type TPlatformUpdate = z.infer<typeof platformDto.update>;
export type TPlatformUpdateBalance = z.infer<typeof platformDto.updateBalance>;
