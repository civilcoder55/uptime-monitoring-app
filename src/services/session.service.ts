import userModel from "../models/user.model";
import sessionModel from "../models/session.model";
import { signToken, TokenTypes, validateToken } from "../utils/jwt.utils";
import { userDocument } from "../types/user.type";
import { sessionDocument } from "../types/session.type";
import { paginator } from "../utils/paginator.utils";

export async function validateUser(email: string, password: string): Promise<userDocument> {
  const user = await userModel.findOne({ email });

  if (user) {
    const hasValidPassword = await user.validatePassword(password);
    if (hasValidPassword) return user;
  }

  throw {
    statusCode: 401,
    message: "Invalid credentials.",
  };
}

export async function createSession(userId: string, userAgent: string, ip: string): Promise<sessionDocument> {
  const session = await sessionModel.create({ user: userId, userAgent, ip });
  return session;
}

export function createTokens(
  user: userDocument,
  session: sessionDocument
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

  const session = await sessionModel.findById(sessionId);

  if (!session) return false;

  const user = await userModel.findOne({ _id: session.user });

  if (!user) return false;

  const accessToken = signToken({ userId: user._id, email: user.email }, TokenTypes.ACCESS_TOKEN);

  return accessToken;
}

export async function getSessions(userId: string, page: string) {
  return await paginator(sessionModel, page, { user: userId });
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  const session = await sessionModel.findOne({ _id: sessionId, user: userId });
  if (!session) {
    throw {
      statusCode: 404,
      message: "Session not found.",
    };
  }

  await session.remove();
}

export async function deleteAllSessions(userId: string): Promise<void> {
  await sessionModel.deleteMany({ user: userId });
}
