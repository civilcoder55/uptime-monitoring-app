import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  verified: boolean;
  verificationToken: string | null;
  verificationTokenExp: Date | null;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(inputPassword: string): Promise<boolean>;
}
