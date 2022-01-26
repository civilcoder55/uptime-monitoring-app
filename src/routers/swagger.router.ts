import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
