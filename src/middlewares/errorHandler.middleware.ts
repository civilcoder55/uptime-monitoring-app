import { Request, Response, NextFunction } from "express";

interface CustomError {
  statusCode: number;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (error: CustomError, req: Request, res: Response, next: NextFunction) {
  return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error." });
}
