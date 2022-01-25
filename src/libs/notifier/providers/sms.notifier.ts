import { UserDocument } from "../../../types/user.type";
import { IAlert } from "../interfaces/alert.interface";
import { INotifier } from "../interfaces/notifier.interface";

export class SmsNotifier implements INotifier {
  notify(user: UserDocument, alert: IAlert): void {
    // if (user.phoneNumber) {
    //   console.log("sms to " + user.phoneNumber);
    // }
  }
}
