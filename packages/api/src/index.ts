import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./router/_app";

type RouterInputs = inferRouterInputs<AppRouter>;

type RouterOutputs = inferRouterOutputs<AppRouter>;

export { type AppRouter, appRouter } from "./router/_app";
export { createTRPCContext } from "./init";
export type { RouterInputs, RouterOutputs };
export * from "./modules/constants";
export { listLogsInputSchema } from "./modules/admin/schema";
// export * from "./modules/hod/schema";
// export * from "./modules/instructor/schema";
// export * from "./modules/advisor/schema";
// export * from "./modules/admin/schema";
