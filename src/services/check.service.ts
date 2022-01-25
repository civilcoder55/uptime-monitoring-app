import { CheckDocument } from "../types/check.type";
import checkModel from "../models/check.model";

export async function createCheck(checkData: CheckDocument): Promise<CheckDocument> {
  return await checkModel.create(checkData);
}

export async function getChecks(userId: string, tags: string | string[]): Promise<CheckDocument[]> {
  if (tags) {
    return await checkModel.find({ user: userId, tags: { $all: tags } });
  }
  return await checkModel.find({ user: userId });
}

export async function getCheck(userId: string, checkId: string): Promise<CheckDocument> {
  const check = await checkModel.findOne({ _id: checkId, user: userId });

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
  Object.assign(check, checkData);
  return await check.save();
}

export async function deleteCheck(userId: string, checkId: string): Promise<void> {
  const check = await getCheck(userId, checkId);
  await check.remove();
}
