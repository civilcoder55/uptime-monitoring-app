import mongoose from "mongoose";
import { UserDocument } from "./user.type";

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  userAgent: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}
