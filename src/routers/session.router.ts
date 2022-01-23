import { Router } from "express";
import { createSessionSchema } from "../schemas/session.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import guardMiddleware from "../middlewares/guard.middleware";
import * as SessionController from "../controllers/session.controller";

const router = Router();

router.post("/sessions", validatorMiddleware(createSessionSchema), SessionController.createSession);
router.get("/sessions", guardMiddleware, SessionController.getSessions);
router.delete("/sessions", guardMiddleware, SessionController.deleteSession);
router.delete("/sessions/all", guardMiddleware, SessionController.deleteAllSessions);

export default router;
