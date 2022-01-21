import express from "express";
import logger from "./logger";
import * as dotenv from "dotenv";

/**
 * load env variables
 */
dotenv.config();

/**
 * init server
 */
const app = express();

/**
 * App Variables
 */
const APP_PORT: number = parseInt(process.env.APP_PORT as string, 10);

/**
 * init database
 */

/**
 *  app middlewares
 */
app.use(express.json());

/**
 * init routers
 */

/**
 * start application
 */
app.listen(APP_PORT || 3003, () => {
  logger.info(`Server up and running on port ${APP_PORT}`);
});
