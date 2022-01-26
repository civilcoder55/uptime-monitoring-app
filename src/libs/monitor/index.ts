import logger from "../../logger";
import checkModel from "../../models/check.model";
import { CheckDocument } from "../../types/check.type";
import { Client } from "../client";
import { NotificationManager } from "../notifier";
import { MailNotifier } from "../notifier/providers/mail.notifier";
import { SmsNotifier } from "../notifier/providers/sms.notifier";
import { Monitor } from "./monitor";

const client = new Client();

const notificationManager = new NotificationManager();

notificationManager.use("mail", new MailNotifier());
notificationManager.use("sms", new SmsNotifier());

class MonitorManager {
  private monitors: Map<string, Monitor> = new Map();

  async start() {
    // fetch all checks from database
    const checks = await checkModel.find({}).populate("user");

    //
    checks.forEach((check) => {
      this.initMonitor(check);
    });
  }

  initMonitor(check: CheckDocument) {
    // make new monitor instance from check
    const monitor = new Monitor(check, client);

    // register monitor by check_id
    this.monitors.set(check._id.toString(), monitor);

    // register notification manager for every monitor
    monitor.on("alert", (alert) => {
      notificationManager.notifyAll(check.user, alert);
    });

    // start monitor instance
    monitor.start();
  }

  async checkCreated(id: string) {
    // fetch the check
    const check = await checkModel.findOne({ _id: id }).populate("user");

    logger.info(`[+] Check with id: ${id} has been added`);

    // init the check monitor
    this.initMonitor(check);
  }

  checkUpdated(id: string) {
    
    if (this.monitors.has(id)) {
      // get the check monitor from exists monitors
      const monitor = this.monitors.get(id) as Monitor;
      logger.info(`[+] Check with id: ${id} has been updated`);
      //update monitor data
      monitor.updateData();
    }
  }

  checkDeleted(id: string) {
    if (this.monitors.has(id)) {
      // get the check monitor from exists monitors
      const monitor = this.monitors.get(id) as Monitor;
      logger.info(`[+] Check with id: ${id} has been deleted`);
      //stop monitor and delete it from exists monitors
      monitor.stop();
      this.monitors.delete(id);
    }
  }
}

const monitorManager = new MonitorManager();

export default monitorManager;
