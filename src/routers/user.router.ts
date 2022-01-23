import { Router } from "express";
import { createUserSchema, verifyUserSchema, resendVerificationSchema } from "../schemas/user.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as UserController from "../controllers/user.controller";

const router = Router();

router.post("/user", validatorMiddleware(createUserSchema), UserController.createUser);
router.post("/user/verify/resend", validatorMiddleware(resendVerificationSchema), UserController.resendVerification);
router.post("/user/verify", validatorMiddleware(verifyUserSchema), UserController.verifiyUser);

export default router;
