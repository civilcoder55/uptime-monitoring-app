import mongoose from "mongoose";
import { PingDocument } from "./ping.type";
import { UserDocument } from "./user.type";

export interface CheckDocument extends mongoose.Document {
  user: UserDocument["_id"];
  email: string;
  name: string;
  host: string;
  port: number;
  protocol: string;
  path: string;
  webhook: string;
  timeout: number; // in seconds
  interval: number; // in seconds
  threshold: number;
  httpHeaders: Record<string, string | string[] | undefined>;
  asserts: Record<string, string | number | boolean>;
  tags: [string];
  ignoreSSL: boolean;
  paused: boolean;
  status: string;
  availability: number;
  outages: number;
  downtime: number;
  uptime: number;
  avgResponseTime: number;
  lastCheck: Date;
  totalRequests: number;
  createdAt: Date;
  updatedAt: Date;
  reload(): Promise<CheckDocument>;
}

export interface checkReport {
  status: string;
  availability: number;
  outages: number;
  downtime: number;
  uptime: number;
  avgResponseTime: number;
  lastCheck: Date;
  history: PingDocument[];
}
