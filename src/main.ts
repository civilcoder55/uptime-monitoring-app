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
import routes from "./routes";
import refresherMiddleware from "./middlewares/refresher.middleware";
import cluster from "cluster";
import monitorManager from "./libs/monitor";
import config from "./config";
import notFoundHandlerMiddleware from "./middlewares/notFoundHandler.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";

/**
 * connect to database
 */
db.connect();

if (cluster.isPrimary) {
  /**
   * init server
   */
  const app = express();

  /**
   * App Variables
   */
  const APP_PORT: number = config.APP_PORT;

  /**
   *  app middlewares
   */
  app.use(express.json());
  app.use(refresherMiddleware);

  /**
   * Register app routes
   */
  app.use("/api/v1", routes);

  /**
   * Global error handlers
   */
  app.use(notFoundHandlerMiddleware); // for not exists routes
  app.use(errorHandlerMiddleware); // for handling errors

  /**
   * start server
   */
  app.listen(APP_PORT || 3003, () => {
    logger.info(`[*] Server running on port ${APP_PORT} on pid ${process.pid}.`);
  });

  // Fork one worker for monitoring service.
  const worker = cluster.fork();

  // make worker global in express app
  app.set("worker", worker);

  cluster.on("exit", (worker) => {
    logger.error(`[x] Worker ${worker.process.pid} died`);
  });
} else {
  logger.info(`[*] Monitor running on pid ${process.pid}`);
  monitorManager.start();

  // register custom event and listener between master process (api) and worker process (monitor) to handle check changes by users
  process.on("message", function (msg: { type: string; data: any }) {
    if (msg.type == "checkCreated") {
      monitorManager.checkCreated(msg.data.id);
    }
    if (msg.type == "checkUpdated") {
      monitorManager.checkUpdated(msg.data.id);
    }

    if (msg.type == "checkDeleted") {
      monitorManager.checkDeleted(msg.data.id);
    }
  });
}
