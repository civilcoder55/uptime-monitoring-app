import mongoose from "mongoose";
import { userDocument } from "./user.type";

export interface sessionDocument extends mongoose.Document {
  user: userDocument["_id"];
  userAgent: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}
