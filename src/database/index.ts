import mongoose from "mongoose";
import logger from "../logger";

const MONGO_URI = process.env.MONGO_URI as string;

export const connect = async () => {
  return mongoose
    .connect(MONGO_URI)
    .then(() => {
      logger.info("[*] Mongo DB connected successfully.");
    })
    .catch((error) => {
      logger.error(error,"[x] Mongo DB connection failed.");
      process.exit(1);
    });
};
