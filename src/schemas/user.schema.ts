import { object, string } from "yup";

export const createUserSchema = object({
  body: object({
    passwordConfirmation: string()
      .required("passwordConfirmation field is required")
      .test("passwords-match", "passwords and passwordConfirmation must match", function (value) {
        return this.parent.password === value;
      }),
    password: string()
      .required("password field is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password must contain 8 characters, at least one uppercase, one lowercase, one number and one special character"
      ),
    email: string().email("email field must be valid email").required("email field is required"),
    name: string().required("name field is required"),
  }),
});

export const verifyUserSchema = object({
  body: object({
    token: string().required("token field is required"),
    email: string().email("email field must be valid email").required("email field is required"),
  }),
});

export const resendVerificationSchema = object({
  body: object({
    email: string().email("email field must be valid email").required("email field is required"),
  }),
});
