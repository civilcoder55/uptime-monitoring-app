import { Router } from "express";
import { createUserSchema, verifyUserSchema, resendVerificationSchema } from "../schemas/user.schema";
import validator from "../middlewares/validator.middleware";
import * as UserController from "../controllers/user.controller";

const router = Router();

router.post("/user", validator(createUserSchema), UserController.createUser);
router.post("/user/verify/resend", validator(resendVerificationSchema), UserController.resendVerification);
router.post("/user/verify", validator(verifyUserSchema), UserController.verifiyUser);

export default router;
