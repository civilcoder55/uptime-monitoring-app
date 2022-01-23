import { object, string } from "yup";

export const createSessionSchema = object({
  body: object({
    password: string().required("password field is required"),
    email: string().email("email field must be valid email").required("email field is required"),
  }),
});
