import mongoose from "mongoose";
import { checkDocument } from "./check.type";

export interface pingDocument extends mongoose.Document {
  check: checkDocument["_id"];
  status: string;
  error: boolean;
  errorMessage: string;
  statusCode: number;
  responseHeaders: Record<string, string | string[] | undefined>;
  timeout: boolean;
  responseTime: number;
  createdAt: Date;
  updatedAt: Date;
}
