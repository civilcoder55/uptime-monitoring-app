import { UserDocument } from "../../../types/user.type";
import { IAlert } from "./alert.interface";

/**
 * Interface for notifier class
 */
export interface INotifier {
  /**
   * notify method to send alert to recipient
   * @param {UserDocument} user
   * @param {IAlert} alert
   */
  notify(user: UserDocument, alert: IAlert): void;
}
