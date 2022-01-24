import mongoose from "mongoose";
import { UserDocument } from "./user.type";

export interface CheckDocument extends mongoose.Document {
  user: UserDocument["_id"];
  name: string;
  url: string;
  protocol: string;
  path: string;
  webhook: string;
  timeout: number; // in seconds
  interval: number; // in seconds
  threshold: number;
  httpHeaders: Record<string, string>;
  asserts: Record<string, string>;
  tags: [string];
  ignoreSSL: boolean;
  createdAt: Date;
  updatedAt: Date;
}
