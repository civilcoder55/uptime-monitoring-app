import mongoose from "mongoose";
import logger from "../logger";
import config from "../config";

export const connect = async () => {
  return mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      logger.info("[*] Mongodb connected successfully.");
    })
    .catch((error) => {
      logger.error(error, "[x] Mongodb connection failed.");
      process.exit(1);
    });
};
