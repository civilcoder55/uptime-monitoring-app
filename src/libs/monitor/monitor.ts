import EventEmitter from "events";
import { checkDocument } from "../../types/check.type";
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
  private outages!: number;
  private lastCheck!: Date;

  private client: Client;
  private check: checkDocument;
  private intervalHandler: NodeJS.Timer | null = null;

  /**
   * Monitor class constructor
   * @param {checkDocument} check check document you need to monitor
   * @param {Client} client client instance to manage polling requests
   */
  constructor(check: checkDocument, client: Client) {
    super();
    this.initData(check);
    this.client = client;
    this.check = check;
    this.registerEvents();
  }

  /**
   * Private method to assign check data to monitor instance
   * @param {checkDocument} check check document you need to monitor
   * @returns {void}
   */
  private initData(check: checkDocument): void {
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
    this.outages = check.outages;
    this.status = check.status;
    this.lastCheck = check.lastCheck;
  }

  /**
   *  Method to handle re-init monitor instance when check get updated
   * @returns {Promise<void>}
   */
  async updateData(): Promise<void> {
    // stop monitoring
    this.stop();

    //update check data from database
    this.check = await this.check.reload();

    //reInit instance data from new check
    this.initData(this.check);

    // start monitoring
    this.start();
  }

  /**
   *  Private method to register monitor events handlers
   * @returns {void}
   */
  private registerEvents(): void {
    this.on("start", this.handleStart);
    this.on("up", this.handleUp);
    this.on("down", this.handleDown);
    this.on("stop", this.handleStop);
  }

  /**
   *  Private method to handle start event
   * @returns {void}
   */
  private handleStart(): void {
    logger.info(`[^] Host: ${this.options.host} polling has been started`);
  }

  /**
   *  Private method to handle up event
   * @returns {void}
   */
  private handleUp(response: any): void {
    if (this.status == "down") {
      this.emit("alert", this.getAlert(response, AlertTypes.UP));
      logger.info(`[^] Host: ${this.options.host} status has been changed from down to up`);
    }

    this.status = "up";
  }

  /**
   *  Private method to handle down event
   * @returns {void}
   */

  private handleDown(response: any): void {
    this.outages += 1;
    if (this.status == "up") {
      if (this.outages > this.threshold) {
        this.emit("alert", this.getAlert(response, AlertTypes.DOWN));
      }
      logger.info(`[^] Host: ${this.options.host} status has been changed from up to down`);
    }
    this.status = "down";
  }

  /**
   *  Private method to handle stop event
   * @returns {void}
   */
  private handleStop(): void {
    logger.info(`[^] Host: ${this.options.host} polling has been stopped`);
  }

  /**
   *  Private method to handle monitoring process and passed as callback for setInterval
   * @returns {Promise<void>}
   */
  private async handler(): Promise<void> {
    logger.info(`[^] New poll to host: ${this.options.host}`);
    try {
      const client = this.client.getProviderByProtocol(this.options.protocol);
      const response = await client.ping(this.options);
      this.lastCheck = new Date();
      this.totalRequests += 1;

      if (response.error || (response.statusCode && response.statusCode != this.asserts?.statusCode)) {
        this.emit("down", response);
      } else {
        this.emit("up", response);
      }

      this.updateCheck(response);
    } catch (error) {
      this.emit("down");
      logger.error(error, "[x] Server error");
    }
  }

  /**
   *  Private method to handle check report details updating and create new ping document inside database
   * @param {IClientResponse} response monitor response object to save as ping
   * @returns {void}
   */
  private updateCheck(response: IClientResponse): void {
    this.check.status = this.status;

    this.check.outages = this.outages;
    this.check.availability = ((this.totalRequests - this.outages) / this.totalRequests) * 100;
    this.check.lastCheck = this.lastCheck;

    if (this.status == "up") {
      this.check.uptime += this.interval;
      this.check.avgResponseTime =
        (response.responseTime + this.check.avgResponseTime * this.check.totalRequests) / this.totalRequests;
    } else {
      this.check.downtime += this.interval;
    }
    this.check.totalRequests = this.totalRequests;
    this.check.save();

    PingModel.create({ check: this.check._id, ...response });
  }

  /**
   *  Private method to generate alert object for notification manager to consume
   * @param {AlertTypes} type alert type "up" or "down"
   * @returns {{ host: string; response: any; type: AlertTypes }}
   */
  private getAlert(response: any, type: AlertTypes): { host: string; response: any; type: AlertTypes } {
    const host: string =
      this.options.protocol == "tcp" ? `${this.options.host}:${this.options.port}` : this.options.host;
    return {
      host,
      response,
      type,
    };
  }

  /**
   *  Method to start monitoring
   * @returns {void}
   */

  start(): void {
    if (!this.paused) {
      this.emit("start");
      this.handler();
      this.intervalHandler = setInterval(this.handler.bind(this), this.interval * 1000);
    }
  }

  /**
   *  Method to stop monitoring
   * @returns {void}
   */
  stop(): void {
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
      this.intervalHandler = null;
      this.paused = true;
      this.emit("stop");
    }
  }
}
