import mongoose from "mongoose";
import { CheckDocument } from "./check.type";

export interface PingDocument extends mongoose.Document {
  check: CheckDocument["_id"];
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
