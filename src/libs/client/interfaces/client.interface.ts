import { IClientOptions } from "./option.interface";
import { IClientResponse } from "./response.interface";

/**
 * Interface for client class
 */
export interface IClient {
  /**
   * ping host and return response object
   * @param {IClientOptions} options
   */
  ping(options: IClientOptions): Promise<IClientResponse>;
}
