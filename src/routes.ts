import { Router } from "express";
import UserRouter from "./routers/user.router";
import SessionRouter from "./routers/session.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(UserRouter);
router.use(SessionRouter);

export default router;
