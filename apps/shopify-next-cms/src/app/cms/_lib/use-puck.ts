import { createUsePuck } from "@puckeditor/core";
import { puckConfig } from "@cms/_lib/config";

export const usePuck = createUsePuck<typeof puckConfig>();
