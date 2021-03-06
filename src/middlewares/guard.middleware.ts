import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user || !user.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  return next();
}
