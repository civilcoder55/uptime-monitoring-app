// import logger from "../logger";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";
import { signToken, TokenTypes, validateToken } from "../utils/jwt.utils";
import { UserDocument } from "../types/user.type";
import { SessionDocument } from "../types/session.type";

export async function validateUser(email: string, password: string): Promise<UserDocument> {
  const user = await UserModel.findOne({ email });

  if (user) {
    const hasValidPassword = await user.validatePassword(password);
    if (hasValidPassword) return user;
  }

  throw {
    statusCode: 401,
    message: "Invalid credentials.",
  };
}

export async function createSession(userId: string, userAgent: string, ip: string): Promise<SessionDocument> {
  const session = await SessionModel.create({ user: userId, userAgent, ip });
  return session;
}

export function createTokens(
  user: UserDocument,
  session: SessionDocument
): { accessToken: string; refreshToken: string } {
  const accessToken = signToken(
    { userId: user._id, email: user.email, sessionId: session._id },
    TokenTypes.ACCESS_TOKEN
  );
  const refreshToken = signToken({ sessionId: session._id }, TokenTypes.REFRESH_TOKEN);
  return {
    accessToken,
    refreshToken,
  };
}

export async function reIssueAccessToken(refreshToken: string): Promise<string | false> {
  const refreshTokenData = validateToken(refreshToken, TokenTypes.REFRESH_TOKEN);

  if (!refreshTokenData.valid) return false;

  const sessionId = refreshTokenData.payload?.sessionId;

  if (!sessionId) return false;

  const session = await SessionModel.findById(sessionId);

  if (!session) return false;

  const user = await UserModel.findOne({ _id: session.user });

  if (!user) return false;

  const accessToken = signToken({ userId: user._id, email: user.email }, TokenTypes.ACCESS_TOKEN);

  return accessToken;
}

export async function getSessions(userId: string): Promise<SessionDocument[]> {
  return await SessionModel.find({ user: userId });
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  const session = await SessionModel.findOne({ _id: sessionId, user: userId });
  if (!session) {
    throw {
      statusCode: 404,
      message: "Session not found.",
    };
  }

  await session.remove();
}

export async function deleteAllSessions(userId: string): Promise<void> {
  await SessionModel.deleteMany({ user: userId });
}
