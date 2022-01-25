import { sendMail } from "../utils/mailer.utils";

export function sendVerificationEmail(email: string, token: string): void {
  const verificationEmail = {
    to: email,
    from: `"Uptime Service" <${process.env.MAILER_FROM as string}>`,
    subject: "Uptime service email verification",
    html: `<strong>Your Verification Token is : </strong> <br> ${token}`,
  };

  sendMail(verificationEmail);
}
