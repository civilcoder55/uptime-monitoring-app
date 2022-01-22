import { Router } from "express";
import UserRouter from "./routers/user.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(UserRouter);

export default router;
