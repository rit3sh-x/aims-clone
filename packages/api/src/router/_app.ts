import { createTRPCRouter } from "../init";
import { spotlightRouter } from "src/modules/spotlight";

export const appRouter = createTRPCRouter({
    spotlight: spotlightRouter,
});

export type AppRouter = typeof appRouter;
