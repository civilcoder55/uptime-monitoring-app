import mongoose from "mongoose";
import { CheckDocument } from "../types/check.type";

const CheckSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    protocol: { type: String },
    path: { type: String },
    webhook: { type: String },
    timeout: { type: Number, default: 5 }, // in seconds
    interval: { type: Number, default: 10 * 60 }, // 10 minutes in seconds
    threshold: { type: Number, default: 1 },
    httpHeaders: { type: Object },
    asserts: { type: Object },
    tags: [String],
    ignoreSSL: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CheckSchema.methods.toJSON = function () {
  const session = this.toObject();
  delete session.__v;
  delete session.user;
  return session;
};

export default mongoose.model<CheckDocument>("Check", CheckSchema);
