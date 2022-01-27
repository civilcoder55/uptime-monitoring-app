import { checkDocument } from "../../../types/check.type";
import { IAlert } from "../interfaces/alert.interface";
import { INotifier } from "../interfaces/notifier.interface";

export class SmsNotifier implements INotifier {
  notify(check: checkDocument, alert: IAlert): void {
    // if (user.phoneNumber) {
    //   console.log("sms to " + user.phoneNumber);
    // }
  }
}
