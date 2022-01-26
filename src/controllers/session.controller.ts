import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import * as SessionService from "../services/session.service";

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await SessionService.validateUser(email, password);
    const session = await SessionService.createSession(
      user._id,
      req.get("user-agent") || "",
      req.socket.remoteAddress || ""
    );
    const tokens = SessionService.createTokens(user, session);
    return res.status(201).json({ data: tokens });
  } catch (error: any) {
    logger.error(error);
    next(error);
  }
}

export async function getSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const sessions = await SessionService.getSessions(userId);
    return res.status(200).json({ data: sessions });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const sessionId = res.locals.user.sessionId;
    await SessionService.deleteSession(userId, sessionId);
    return res.status(200).json({ message: "Session deleted Successfully." });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteAllSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    await SessionService.deleteAllSessions(userId);
    return res.status(200).json({ message: "All sessions deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
