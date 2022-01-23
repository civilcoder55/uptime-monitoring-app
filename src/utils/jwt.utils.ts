import jwt from "jsonwebtoken";
import tokenSecret from "../secrets/token.secret";


const config = {
  accessToken: {
    ttl: process.env.ACCESS_TOKEN_TTL as string,
    privateKey: tokenSecret.ACCESS_TOKEN_PRIVATE_KEY,
    publicKey: tokenSecret.ACCESS_TOKEN_PUBLIC_KEY,
  },
  refreshToken: {
    ttl: process.env.REFRESH_TOKEN_TTL as string,
    privateKey: tokenSecret.REFRESH_TOKEN_PRIVATE_KEY,
    publicKey: tokenSecret.REFRESH_TOKEN_PUBLIC_KEY,
  },
};


export enum TokenTypes {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
}

export function signToken(payload: Record<string, string>, type: TokenTypes) {
  return jwt.sign(payload, config[type].privateKey, { expiresIn: config[type].ttl, algorithm: "RS256" });
}

export function validateToken(token: string, type: TokenTypes) {
  try {
    const payload = jwt.verify(token, config[type].publicKey) as Record<string, string>;
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
