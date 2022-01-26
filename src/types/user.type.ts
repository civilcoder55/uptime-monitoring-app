import mongoose from "mongoose";

export interface userDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  verified: boolean;
  verificationToken: string;
  verificationTokenExp: Date | null;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(inputPassword: string): Promise<boolean>;
}
