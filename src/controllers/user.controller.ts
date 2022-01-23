import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import { UserDocument } from "../types/user.type";

export async function createUser(req: Request, res: Response) {
  try {
    const userData: UserDocument = req.body;
    const user = await UserService.createUser(userData);
    return res.status(201).json({ data: user });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function resendVerification(req: Request, res: Response) {
  try {
    const email: string = req.body.email;

    await UserService.resendVerification(email);
    return res.status(200).json({ message: "If email is valid, verification email will be sent to it." });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function verifiyUser(req: Request, res: Response) {
  try {
    const email: string = req.body.email;
    const token: string = req.body.token;
    await UserService.verifiyUser(email, token);
    return res.status(200).json({ message: "User verified successfully." });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}
