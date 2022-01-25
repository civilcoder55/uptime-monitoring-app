import config from "../../../config";
import { UserDocument } from "../../../types/user.type";
import { sendMail } from "../../../utils/mailer.utils";
import { AlertTypes, IAlert } from "../interfaces/alert.interface";
import { INotifier } from "../interfaces/notifier.interface";

export class MailNotifier implements INotifier {
  private makeMail(email: string, alert: IAlert) {
    const mail: any = {};

    mail.to = email;

    mail.from = `"Uptime Service" <${config.MAILER_FROM}>`;

    if (alert.type == AlertTypes.UP) {
      mail.subject = "Your host is up and running";
      mail.html = `<strong> your host ${alert.host} is now up and running </strong> <br>`;

      if (alert.response?.responseTime) {
        mail.html += `response time : ${alert.response.responseTime} ms <br>`;
      }

      if (alert.response?.statusCode) {
        mail.html += `status code : ${alert.response.statusCode} <br> `;
      }

      if (alert.response?.responseHeaders) {
        mail.html += `response headers : <pre><code> ${JSON.stringify(alert.response.responseHeaders)}</code></pre>`;
      }
    } else {
      mail.subject = "Your host is down";
      mail.html = `<strong> your host ${alert.host} goes down </strong> <br>`;

      if (alert.response?.responseTime) {
        mail.html += `response time : ${alert.response.responseTime} ms <br>`;
      }

      if (alert.response?.statusCode) {
        mail.html += `status code : ${alert.response.statusCode} <br> `;
      }

      if (alert.response?.timeout) {
        mail.html += `timeout: ${alert.response.timeout} <br> `;
      }

      if (alert.response?.errorMessage) {
        mail.html += `error message: ${alert.response.errorMessage} <br> `;
      }

      if (alert.response?.responseHeaders) {
        mail.html += `response headers : <pre><code> ${JSON.stringify(alert.response.responseHeaders)}</code></pre>`;
      }
    }

    return mail;
  }

  notify(user: UserDocument, alert: IAlert): void {
    if (user.email) {
      const alertEmail = this.makeMail(user.email, alert);
      sendMail(alertEmail);
    }
  }
}
