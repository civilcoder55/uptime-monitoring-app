import { Request, Response } from "express";
import { CheckDocument } from "../types/check.type";
import * as CheckService from "../services/check.service";

export async function createCheck(req: Request, res: Response) {
  try {
    const checkData: CheckDocument = req.body;
    checkData.user = res.locals.user.userId;
    checkData.email = res.locals.user.email;
    const check = await CheckService.createCheck(checkData);

    //emit custom event for monitor worker process
    req.app.get("worker").send({ type: "checkCreated", data: { id: check._id } });

    return res.status(201).json({ data: check });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function getChecks(req: Request, res: Response) {
  try {
    const userId = res.locals.user.userId;
    const tags = req.query.tags as string | string[];
    const checks = await CheckService.getChecks(userId, tags);
    return res.status(200).json({ data: checks });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function getCheck(req: Request, res: Response) {
  try {
    const userId = res.locals.user.userId;
    const checkId = req.params.id;
    const check = await CheckService.getCheck(userId, checkId);
    return res.status(200).json({ data: check });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function updateCheck(req: Request, res: Response) {
  try {
    const userId = res.locals.user.userId;
    const checkId = req.params.id;
    const checkData: CheckDocument = req.body;
    const check = await CheckService.updateCheck(userId, checkId, checkData);

    //emit custom event for monitor worker process
    req.app.get("worker").send({ type: "checkUpdated", data: { id: check._id } });

    return res.status(200).json({ data: check });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}

export async function deleteCheck(req: Request, res: Response) {
  try {
    const userId = res.locals.user.userId;
    const checkId = req.params.id;
    await CheckService.deleteCheck(userId, checkId);

    //emit custom event for monitor worker process
    req.app.get("worker").send({ type: "checkDeleted", data: { id: checkId } });

    return res.status(200).json({ message: "Check deleted successfully." });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error." });
  }
}
