import { userDocument } from "../types/user.type";
import userModel from "../models/user.model";
import { generateToken } from "../utils/helper.utils";
import { sendVerificationEmail } from "./mail.service";

export async function createUser(userData: userDocument): Promise<userDocument> {
  const sameUser = await userModel.findOne({ email: userData.email });

  if (sameUser) {
    throw {
      statusCode: 409,
      message: "User email already exists.",
    };
  }

  userData.verificationToken = await generateToken();
  userData.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour

  const user = await userModel.create(userData);
  sendVerificationEmail(user.email, user.verificationToken);
  return user;
}

export async function verifiyUser(email: string, token: string): Promise<void> {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw {
      statusCode: 404,
      message: "Email not found.",
    };
  }

  if (token !== user?.verificationToken) {
    throw {
      statusCode: 400,
      message: "Invaild verification token.",
    };
  }
  if (new Date() > new Date(user.verificationTokenExp as Date)) {
    throw {
      statusCode: 400,
      message: "Expired verification token.",
    };
  }

  user.verified = true;
  user.verificationToken = "";
  user.verificationTokenExp = null;

  await user.save();
}

export async function resendVerification(email: string): Promise<void> {
  const user = await userModel.findOne({ email });
  if (user && !user.verified) {
    user.verificationToken = await generateToken();
    user.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour
    await user.save();
    sendVerificationEmail(user.email, user.verificationToken);
  }
}
