import { UserDocument } from "../types/user.type";
import logger from "../logger";
import User from "../models/user.model";
import { randomBytes } from "crypto";

export const createUser = async function (userData: UserDocument) {
  try {
    userData.verificationToken = await generateToken();
    userData.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour
    userData.verified = false;
    return await User.create(userData);
  } catch (error: any) {
    logger.error(error);
    if (error.code === 11000) {
      throw {
        statusCode: 409,
        message: "User email already exists.",
      };
    }
  }
};

const generateToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    randomBytes(48, function (err, buffer) {
      resolve(buffer.toString("hex"));
    });
  });
};

export const verifiyUser = async function (email: string, token: string) {
  const user = await User.findOne({ email });
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

  user.save();
};

export const resendVerification = async function (email: string) {
  const user = await User.findOne({ email });
  if (user && !user.verified) {
    user.verificationToken = await generateToken();
    user.verificationTokenExp = new Date(Date.now() + 60 * 60 * 1000); // now + 1 hour
    await user.save();

    //send email
  }
};
