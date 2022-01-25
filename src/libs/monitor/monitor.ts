import EventEmitter from "events";
import { CheckDocument } from "../../types/check.type";
import logger from "../../logger";
import { Client } from "../client";
import PingModel from "../../models/ping.model";
import { IClientResponse } from "../client/interfaces/response.interface";
import { AlertTypes } from "../notifier/interfaces/alert.interface";

export class Monitor extends EventEmitter {
  private interval!: number;
  private asserts!: Record<string, string | number | boolean>;
  private paused!: boolean;
  private threshold!: number;

  private options: any;

  private status!: string;
  private totalRequests!: number;
  private totalDowns!: number;
  private lastCheck!: Date;
  private lastResponse = {};

  private client: Client;
  private check: CheckDocument;
  private intervalHandler: NodeJS.Timer | null = null;

  constructor(check: CheckDocument, client: Client) {
    super();
    this.initData(check);
    this.client = client;
    this.check = check;
    this.registerEvents();
  }

  private initData(check: CheckDocument) {
    this.options = {
      host: check.host,
      protocol: check.protocol,
      timeout: check.timeout,
      port: check.port,
      ignoreSSL: check.ignoreSSL,
      httpHeaders: check.httpHeaders,
      path: check.path,
    };
    this.interval = check.interval;
    this.asserts = {
      statusCode: check.asserts?.statusCode || 200,
      ...check.asserts,
    };
    this.paused = check.paused;
    this.threshold = check.threshold;

    this.totalRequests = check.totalRequests;
    this.totalDowns = check.totalDowns;
    this.status = check.status;
    this.lastCheck = check.lastCheck;
  }

  async updateData() {
    // stop monitoring
    this.stop();

    //update check data from database
    this.check = await this.check.reload();

    //reInit instance data from new check
    this.initData(this.check);

    // start monitoring
    this.start();
  }

  private registerEvents() {
    this.on("start", this.handleStart);
    this.on("up", this.handleUp);
    this.on("down", this.handleDown);
    this.on("stop", this.handleStop);
    this.on("alert", () => false);
  }

  private handleStart() {
    logger.info("Host " + this.options.host + " polling starts");
  }

  private handleUp() {
    if (this.status == "down") {
      this.emit("alert", this.getAlert(AlertTypes.UP));
      logger.info("Host " + this.options.host + " goes up");
    }

    this.status = "up";
  }

  private handleDown() {
    if (this.status == "up") {
      if (this.totalDowns > this.threshold) {
        this.emit("alert", this.getAlert(AlertTypes.DOWN));
      }
      logger.info("Host " + this.options.host + " goes down");
    }
    this.totalDowns += 1;
    this.status = "down";
  }

  private handleStop() {
    logger.info("Host " + this.options.host + " polling stopped");
  }

  private async handler() {
    logger.info("polling host " + this.options.host);
    const client = this.client.getProviderByProtocol(this.options.protocol);
    const response = await client.ping(this.options);
    this.lastResponse = response;
    this.lastCheck = new Date();
    this.totalRequests += 1;

    if (response.error || (response.statusCode && response.statusCode != this.asserts?.statusCode)) {
      this.emit("down");
    } else {
      this.emit("up");
    }

    this.updateCheck(response);
  }

  private updateCheck(response: IClientResponse) {
    this.check.totalRequests = this.totalRequests;
    this.check.lastCheck = this.lastCheck;
    this.check.status = this.status;
    this.check.totalDowns = this.totalDowns;
    this.check.save();

    PingModel.create({ check: this.check._id, ...response });
  }

  private getAlert(type: AlertTypes) {
    const host = this.options.protocol == "tcp" ? `${this.options.host}:${this.options.port}` : this.options.host;
    return {
      host,
      response: this.lastResponse,
      type,
    };
  }

  start() {
    if (!this.paused) {
      this.emit("start");
      this.handler();
      this.intervalHandler = setInterval(this.handler.bind(this), this.interval * 1000);
    }
  }

  stop() {
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
      this.intervalHandler = null;
      this.paused = true;
      this.emit("stop");
    }
  }
}
