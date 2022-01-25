import { IClientOptions } from "../interfaces/option.interface";
import { IClientResponse } from "../interfaces/response.interface";
import { IClient } from "../interfaces/client.interface";
import https from "https";
import logger from "../../../logger";

export class HttpsClient implements IClient {
  ping(options: IClientOptions): Promise<IClientResponse> {
    return new Promise((resolve) => {
      const opt: https.RequestOptions = {
        hostname: options.host,
        path: options.path || "",
        method: "GET",
        headers: {
          ...options.httpHeaders,
        },
        timeout: options.timeout * 1000,
        rejectUnauthorized: options.ignoreSSL,
      };

      const result = {} as IClientResponse;

      const startTime = process.hrtime();

      https
        .request(opt, (res) => {
          if (!result.responseTime) {
            const totalTime = process.hrtime(startTime);
            result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
          }
          result.statusCode = res.statusCode;
          result.responseHeaders = res.headers;
          resolve(result);
        })
        .on("error", (error) => {
          if (!result.responseTime) {
            const totalTime = process.hrtime(startTime);
            result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
          }
          logger.error(error, "Error https request to " + options.host);
          result.error = true;
          result.errorMessage = error.message;
          resolve(result);
        })
        .on("timeout", () => {
          if (!result.responseTime) {
            const totalTime = process.hrtime(startTime);
            result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
          }
          result.error = true;
          result.timeout = true;
          resolve(result);
        })
        .end();
    });
  }
}
