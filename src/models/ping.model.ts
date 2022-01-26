import mongoose from "mongoose";
import { pingDocument } from "../types/ping.type";

const PingSchema = new mongoose.Schema(
  {
    check: { type: mongoose.Schema.Types.ObjectId, ref: "Check", required: true, index: true },
    status: { type: String },
    error: { type: Boolean, default: false },
    errorMessage: { type: String },
    statusCode: { type: Number },
    responseHeaders: { type: Object },
    timeout: { type: Boolean, default: false },
    responseTime: { type: Number },
  },
  { timestamps: true }
);

PingSchema.methods.toJSON = function () {
  const ping = this.toObject();
  delete ping.check;
  delete ping._id;
  delete ping.updatedAt;
  delete ping.__v;
  return ping;
};

export default mongoose.model<pingDocument>("Ping", PingSchema);
