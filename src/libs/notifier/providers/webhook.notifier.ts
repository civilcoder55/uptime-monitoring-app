import { checkDocument } from "../../../types/check.type";
import { IAlert } from "../interfaces/alert.interface";
import { INotifier } from "../interfaces/notifier.interface";
import axios from "axios";
import logger from "../../../logger";

export class webhookNotifier implements INotifier {
  notify(check: checkDocument, alert: IAlert): void {
    if (check.webhook) {
      // just simple post request for now 
      axios.post(check.webhook, JSON.stringify(alert)).catch((error) => {
        logger.error(error);
      });
    }
  }
}
