/**
 * Load env variables
 */
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Modules imports
 */
import express from "express";
import logger from "./logger";
import * as db from "./database";

/**
 * init server
 */
const app = express();

/**
 * App Variables
 */
const APP_PORT: number = parseInt(process.env.APP_PORT as string, 10);

/**
 * connect to database
 */
db.connect();

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
  logger.info(`Server up and running on port ${APP_PORT}.`);
});
