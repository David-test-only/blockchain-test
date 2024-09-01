import { z } from "zod";
import { assetDto } from "./asset.dto";

export type TAssetCreate = z.infer<typeof assetDto.create>;
export type TAssetGet = z.infer<typeof assetDto.get>;
