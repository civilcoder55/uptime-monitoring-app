import mongoose from "mongoose";
import { sessionDocument } from "../types/session.type";

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

SessionSchema.methods.toJSON = function () {
  const session = this.toObject();
  delete session.__v;
  delete session.user;
  return session;
};

export default mongoose.model<sessionDocument>("Session", SessionSchema);
