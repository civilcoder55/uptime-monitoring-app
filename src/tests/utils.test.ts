import { generateToken } from "../utils/helper.utils";
import { signToken, TokenTypes, validateToken } from "../utils/jwt.utils";

test("Should generate random token", async () => {
  const token = await generateToken();
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(token.length).toBe(96);
});

test("Should sign jwt token", async () => {
  const token = signToken({ username: "test" }, TokenTypes.ACCESS_TOKEN);
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/);
});

test("Should validate jwt token", async () => {
  const token = signToken({ username: "test" }, TokenTypes.ACCESS_TOKEN);
  const result = validateToken(token, TokenTypes.ACCESS_TOKEN);
  expect(result).not.toBeNull();
  expect(typeof result).toBe("object");
  expect(result.valid).toBeTruthy();
  expect(result.expired).toBeFalsy();
  expect(result.payload).toMatchObject({ username: "test" });
});

const mockedSendMail = jest.fn();

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: mockedSendMail,
  }),
}));

import { sendMail } from "../utils/mailer.utils";

test("Should send email", () => {
  sendMail({ to: "test@test.com" });
  expect(mockedSendMail).toHaveBeenCalled();
});
