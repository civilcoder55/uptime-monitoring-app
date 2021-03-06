import { Router } from "express";
import { createCheckSchema } from "../schemas/check.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import guardMiddleware from "../middlewares/guard.middleware";
import * as CheckController from "../controllers/check.controller";

const router = Router();

router.post("/checks", guardMiddleware, validatorMiddleware(createCheckSchema), CheckController.createCheck);
router.get("/checks", guardMiddleware, CheckController.getChecks);
router.get("/checks/:id", guardMiddleware, CheckController.getCheck);
router.get("/checks/:id/report", guardMiddleware, CheckController.getCheckReport);
router.put("/checks/:id", guardMiddleware, validatorMiddleware(createCheckSchema), CheckController.updateCheck);
router.patch("/checks/:id/toggle", guardMiddleware, CheckController.toggleCheckMonitoring);
router.delete("/checks/:id", guardMiddleware, CheckController.deleteCheck);

export default router;
