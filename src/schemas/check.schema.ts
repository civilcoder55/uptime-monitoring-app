import { array, boolean, lazy, mixed, number, object, string } from "yup";

export const createCheckSchema = object({
  body: object({
    httpHeaders: lazy((value) =>
      object().shape(value && Object.keys(value).reduce((map, key) => ({ ...map, [key]: mixed() }), {}))
    ),
    asserts: lazy((value) =>
      object().shape(value && Object.keys(value).reduce((map, key) => ({ ...map, [key]: mixed() }), {}))
    ),
    tags: array().of(string()).typeError("tags field must be array of strings"),
    ignoreSSL: boolean().typeError("ignoreSSL field must be boolean"),
    timeout: number()
      .typeError("timeout field must be number")
      .min(5, "timeout must be greater than or equal 5 seconds"),
    interval: number()
      .typeError("interval field must be number")
      .min(60, "interval must be greater than or equal 60 seconds"),
    threshold: number().typeError("threshold field must be number").min(1, "threshold must be greater than or equal 1"),
    webhook: string().matches(
      /(https?:\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "webhook field must be correct https url !"
    ),

    path: string().typeError("path field must be string"),
    port: number()
      .typeError("port field must be number")
      .min(0, "port must be greater than or equal 0 ")
      .max(65535, "port must be less than or equal 65535")
      .when("protocol", {
        is: (protocol: string) => protocol === "tcp",
        then: number().required(),
      }),
    host: string()
      .required("host field is required")
      .when("protocol", {
        is: (protocol: string) => protocol === "tcp",
        then: string().matches(
          /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/,
          "host field must be correct ipv4 !"
        ),
      })
      .when("protocol", {
        is: (protocol: string) => protocol !== "tcp",
        then: string().matches(
          /(http(s)?:\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "host field must be correct url !"
        ),
      }),
    protocol: mixed().required("protocol field is required").oneOf(["http", "https", "tcp"]),
    name: string().required("name field is required"),
  }),
});
