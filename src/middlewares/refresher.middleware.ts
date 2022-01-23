/**
 * The `refresher` middleware enables validate Authorization token and reIssue new Access Token
 * in case of expired
 */
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../services/session.service";
import { TokenTypes, validateToken } from "../utils/jwt.utils";

export default async function (req: Request, res: Response, next: NextFunction) {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  const refreshToken = req.header("x-refresh-token");

  if (!accessToken) {
    return next();
  }

  const accessTokenData = validateToken(accessToken, TokenTypes.ACCESS_TOKEN);

  if (accessTokenData.valid) {
    res.locals.user = accessTokenData.payload;
  }

  if (accessTokenData.expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      const newAccessTokenData = validateToken(newAccessToken, TokenTypes.ACCESS_TOKEN);
      res.locals.user = newAccessTokenData.payload;
      res.setHeader("x-access-token", newAccessToken);
    }
  }

  return next();
}
