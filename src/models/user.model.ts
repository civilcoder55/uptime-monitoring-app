import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userDocument } from "../types/user.type";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExp: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.verificationToken
  delete user.verificationTokenExp
  return user;
};

UserSchema.methods.validatePassword = async function (inputPassword: string) {
  return bcrypt.compareSync(inputPassword, this.password);
};

export default mongoose.model<userDocument>("User", UserSchema);
