import { UserDocument } from "../types/user.type";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/helper.utils";

export async function createUser(userData: UserDocument): Promise<UserDocument> {
  const sameUser = await UserModel.findOne({ email: userData.email });

  if (sameUser) {
    throw {
      statusCode: 409,
      message: "User email already exists.",
    };
  }

  userData.verificationToken = await generateToken();
  userData.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour
  return await UserModel.create(userData);
}



export async function verifiyUser(email: string, token: string): Promise<void> {
  const user = await UserModel.findOne({ email });
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
  user.verificationToken = null;
  user.verificationTokenExp = null;

  await user.save();
}

export async function resendVerification(email: string): Promise<void> {
  const user = await UserModel.findOne({ email });
  if (user && !user.verified) {
    user.verificationToken = await generateToken();
    user.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour
    await user.save();

    //send email
  }
}
