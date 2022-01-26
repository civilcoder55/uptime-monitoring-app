import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { userDocument } from "../types/user.type";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: userDocument = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json({ data: user });
  } catch (error: any) {
    next(error);
  }
}

export async function resendVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const email: string = req.body.email;

    await userService.resendVerification(email);
    return res.status(200).json({ message: "If email is valid, verification email will be sent to it." });
  } catch (error: any) {
    next(error);
  }
}

export async function verifiyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email: string = req.body.email;
    const token: string = req.body.token;
    await userService.verifiyUser(email, token);
    return res.status(200).json({ message: "User verified successfully." });
  } catch (error: any) {
    next(error);
  }
}
