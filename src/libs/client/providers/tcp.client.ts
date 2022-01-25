import { IClientOptions } from "../interfaces/option.interface";
import { IClientResponse } from "../interfaces/response.interface";
import { IClient } from "../interfaces/client.interface";
import net from "net";
import logger from "../../../logger";

export class TcpClient implements IClient {
  ping(options: IClientOptions): Promise<IClientResponse> {
    return new Promise((resolve) => {
      const socket = new net.Socket();

      const result = {} as IClientResponse;

      const startTime = process.hrtime();

      socket.setTimeout(options.timeout * 1000, () => {
        if (!result.responseTime) {
          const totalTime = process.hrtime(startTime);
          result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
        }
        result.error = true;
        result.timeout = true;
        resolve(result);
      });

      socket
        .connect(options.port as number, options.host, function () {
          if (!result.responseTime) {
            const totalTime = process.hrtime(startTime);
            result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
          }
          socket.destroy();
        })
        .on("error", (error) => {
          if (!result.responseTime) {
            const totalTime = process.hrtime(startTime);
            result.responseTime = totalTime[0] * 1000 + totalTime[1] / 1000000;
          }
          logger.error(error, "Error tcp connection to host " + options.host + ":" + options.port);
          result.error = true;
          result.errorMessage = error.message;
          socket.destroy();
          resolve(result);
        })
        .on("close", () => {
          resolve(result);
        });
    });
  }
}
