import { checkDocument } from "../../../types/check.type";
import { IAlert } from "./alert.interface";

/**
 * Interface for notifier class
 */
export interface INotifier {
  /**
   * notify method to send alert to recipient
   * @param {checkDocument} check
   * @param {IAlert} alert
   */
  notify(check: checkDocument, alert: IAlert): void;
}
