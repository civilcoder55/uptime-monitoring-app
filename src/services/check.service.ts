import { CheckDocument } from "../types/check.type";
import CheckModel from "../models/check.model";

export async function createCheck(userId: string, checkData: CheckDocument): Promise<CheckDocument> {
  // double check for correct protocol
  if (checkData.protocol !== "tcp") {
    checkData.protocol = checkData.url.startsWith("https") ? "https" : "http";
  }
  checkData.user = userId;

  return await CheckModel.create(checkData);
}

export async function getChecks(userId: string, tags: string | string[]): Promise<CheckDocument[]> {
  if (tags) {
    return await CheckModel.find({ user: userId, tags: { $all: tags } });
  }
  return await CheckModel.find({ user: userId });
}

export async function getCheck(userId: string, checkId: string): Promise<CheckDocument> {
  const check = await CheckModel.findOne({ _id: checkId, user: userId });

  if (!check) {
    throw {
      statusCode: 404,
      message: "Check not found.",
    };
  }
  return check;
}

export async function updateCheck(userId: string, checkId: string, checkData: CheckDocument): Promise<CheckDocument> {
  const check = await getCheck(userId, checkId);
  // double check for correct protocol
  if (checkData.protocol !== "tcp") {
    checkData.protocol = checkData.url.startsWith("https") ? "https" : "http";
  }

  Object.assign(check, checkData);
  return await check.save();
}

export async function deleteCheck(userId: string, checkId: string): Promise<void> {
  const check = await getCheck(userId, checkId);

  await check.remove();
}
