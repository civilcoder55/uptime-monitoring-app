import { Router } from "express";
import UserRouter from "./routers/user.router";
import SessionRouter from "./routers/session.router";
import CheckRouter from "./routers/check.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(UserRouter);
router.use(SessionRouter);
router.use(CheckRouter);

export default router;
