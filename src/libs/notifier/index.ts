import logger from "../../logger";
import { UserDocument } from "../../types/user.type";
import { IAlert } from "./interfaces/alert.interface";
import { INotifier } from "./interfaces/notifier.interface";

export class NotificationManager {
  private notifiers: Map<string, INotifier> = new Map();

  /**
   * Method to register new notifier
   * @param {INotifier} notifier
   */
  use(notifierName: string, notifier: INotifier) {
    this.notifiers.set(notifierName, notifier);
  }

  /**
   * Method to invoke notify method on notifier class to send actual notification
   * @param {IAlert} alert
   */
  notifyAll(user: UserDocument, alert: IAlert) {
    this.notifiers.forEach(function (notifier: INotifier, notifierName: string) {
      try {
        notifier.notify(user, alert);
        logger.info(`[^] Notification sent from ${notifierName}`);
      } catch (error: any) {
        logger.info(error, `[x] ${notifierName} notification failed`);
      }
    });
  }
}
