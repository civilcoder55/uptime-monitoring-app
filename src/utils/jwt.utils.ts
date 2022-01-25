import jwt from "jsonwebtoken";
import config from "../config";

const jwtConfig = {
  accessToken: {
    ttl: config.ACCESS_TOKEN_TTL,
    privateKey: config.ACCESS_TOKEN_PRIVATE_KEY,
    publicKey: config.ACCESS_TOKEN_PUBLIC_KEY,
  },
  refreshToken: {
    ttl: config.REFRESH_TOKEN_TTL,
    privateKey: config.REFRESH_TOKEN_PRIVATE_KEY,
    publicKey: config.REFRESH_TOKEN_PUBLIC_KEY,
  },
};

export enum TokenTypes {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
}

export function signToken(payload: Record<string, string>, type: TokenTypes) {
  return jwt.sign(payload, jwtConfig[type].privateKey, { expiresIn: jwtConfig[type].ttl, algorithm: "RS256" });
}

export function validateToken(token: string, type: TokenTypes) {
  try {
    const payload = jwt.verify(token, jwtConfig[type].publicKey) as Record<string, string>;
    return {
      valid: true,
      expired: false,
      payload,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      payload: null,
    };
  }
}
