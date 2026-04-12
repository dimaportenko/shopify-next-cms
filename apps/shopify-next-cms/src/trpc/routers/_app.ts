import { router } from "../init";
import { cmsRouter } from "./cms";
import { mediaRouter } from "./media";
import { fontsRouter } from "./fonts";

export const appRouter = router({
  cms: cmsRouter,
  media: mediaRouter,
  fonts: fontsRouter,
});

export type AppRouter = typeof appRouter;
