import { randomBytes } from "crypto";

export function generateToken(): Promise<string> {
  return new Promise((resolve) => {
    randomBytes(48, function (err, buffer) {
      resolve(buffer.toString("hex"));
    });
  });
}
