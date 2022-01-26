import { Router } from "express";
import userRouter from "./routers/user.router";
import sessionRouter from "./routers/session.router";
import checkRouter from "./routers/check.router";
import swaggerRouter from "./routers/swagger.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(userRouter);
router.use(sessionRouter);
router.use(checkRouter);
router.use(swaggerRouter);

export default router;
