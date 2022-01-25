import mongoose from "mongoose";
import { PingDocument } from "../types/ping.type";

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
  const session = this.toObject();
  delete session.__v;
  return session;
};

export default mongoose.model<PingDocument>("Ping", PingSchema);
