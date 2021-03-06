import { IClientOptions } from "../interfaces/option.interface";
import { IClientResponse } from "../interfaces/response.interface";
import { IClientProvider } from "../interfaces/client.interface";
import http from "http";

export class HttpClient implements IClientProvider {
  ping(options: IClientOptions): Promise<IClientResponse> {
    return new Promise((resolve) => {
      const opt: http.RequestOptions = {
        hostname: options.host,
        path: options.path || "",
        method: "GET",
        headers: {
          ...options.httpHeaders,
        },
        timeout: options.timeout * 1000,
      };

      const result = {} as IClientResponse;

      const startTime = process.hrtime();
      http
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
          result.error = true;
          result.errorMessage = error.message;
          resolve(result);
        })
        .on("timeout", () => {
          result.error = true;
          result.timeout = true;
          resolve(result);
        })
        .end();
    });
  }
}
