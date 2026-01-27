import { createLoader } from "nuqs/server";
import { tenantParams } from "../params";

export const tenantParamsLoader = createLoader(tenantParams);
