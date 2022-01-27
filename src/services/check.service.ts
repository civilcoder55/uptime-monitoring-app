import { checkDocument, checkReport } from "../types/check.type";
import checkModel from "../models/check.model";
import pingModel from "../models/ping.model";
import { paginator } from "../utils/paginator.utils";

export async function createCheck(checkData: checkDocument): Promise<checkDocument> {
  return await checkModel.create(checkData);
}

export async function getChecks(userId: string, tags: string | string[], page: string) {
  if (tags) {
    return await paginator(checkModel, page, { user: userId, tags: { $all: tags } });
  }
  return await paginator(checkModel, page, { user: userId });
}

export async function getCheck(userId: string, checkId: string): Promise<checkDocument> {
  const check = await checkModel.findOne({ _id: checkId, user: userId });
  if (!check) {
    throw {
      statusCode: 404,
      message: "Check not found.",
    };
  }
  return check;
}

export async function getCheckReport(userId: string, checkId: string): Promise<checkReport> {
  const check = await checkModel.findOne({ _id: checkId, user: userId });

  if (!check) {
    throw {
      statusCode: 404,
      message: "Check not found.",
    };
  }

  const pings = await pingModel.find({ check: check._id }).sort('-createdAt').skip(0).limit(10);
  const checkReport = {
    status: check.status,
    availability: check.availability,
    outages: check.outages,
    downtime: check.downtime,
    uptime: check.uptime,
    avgResponseTime: check.avgResponseTime,
    lastCheck: check.lastCheck,
    history: pings,
  };

  return checkReport;
}

export async function updateCheck(userId: string, checkId: string, checkData: checkDocument): Promise<checkDocument> {
  const check = await getCheck(userId, checkId);
  Object.assign(check, checkData);
  return await check.save();
}

export async function deleteCheck(userId: string, checkId: string): Promise<void> {
  const check = await getCheck(userId, checkId);
  await check.remove();
  await checkModel.deleteMany({ check: checkId, user: userId });
}

export async function toggleCheckMonitoring(userId: string, checkId: string): Promise<checkDocument> {
  const check = await getCheck(userId, checkId);
  check.paused = !check.paused;
  await check.save();
  return check;
}
