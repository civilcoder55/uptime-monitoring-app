import nodemailer from "nodemailer";
import logger from "../logger";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.MAILER_HOST,
  port: config.MAILER_PORT,
  auth: {
    user: config.MAILER_USER,
    pass: config.MAILER_PASSWORD,
  },
});

export function sendMail(mailOptions: nodemailer.SendMailOptions) {
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      logger.error(error, "Email sent error.");
    }
  });
}
