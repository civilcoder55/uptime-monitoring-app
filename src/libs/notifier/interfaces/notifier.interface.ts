import { userDocument } from "../../../types/user.type";
import { IAlert } from "./alert.interface";

/**
 * Interface for notifier class
 */
export interface INotifier {
  /**
   * notify method to send alert to recipient
   * @param {userDocument} user
   * @param {IAlert} alert
   */
  notify(user: userDocument, alert: IAlert): void;
}
