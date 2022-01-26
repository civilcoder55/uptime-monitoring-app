import mongoose from "mongoose";
import { checkDocument } from "../types/check.type";

const CheckSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    host: { type: String, required: true },
    port: { type: Number },
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
    paused: { type: Boolean, default: false },
    status: { type: String, default: false },
    availability: { type: Number, default: false },
    outages: { type: Number, default: 0 },
    downtime: { type: Number, default: false },
    uptime: { type: Number, default: false },
    avgResponseTime: { type: Number, default: false },
    lastCheck: { type: Date },
    totalRequests: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CheckSchema.pre("save", async function (next) {
  // double check for correct protocol
  if (this.protocol !== "tcp") {
    this.protocol = this.host.startsWith("https") ? "https" : "http";
    this.host = this.host.replace("https://", "");
    this.host = this.host.replace("http://", "");
    if (this.host[this.host.length - 1] === "/") this.host = this.host.slice(0, -1); //strip path "/" from end
  }
  next();
});

CheckSchema.methods.reload = async function () {
  return this.model("Check").findById(this._id);
};

CheckSchema.methods.toJSON = function () {
  const check = this.toObject();
  delete check.__v;
  delete check.user;
  return check;
};

export default mongoose.model<checkDocument>("Check", CheckSchema);
