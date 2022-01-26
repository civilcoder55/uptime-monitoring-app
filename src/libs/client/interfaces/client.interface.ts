import { IClientOptions } from "./option.interface";
import { IClientResponse } from "./response.interface";

/**
 * Interface for client provider class
 */
export interface IClientProvider {
  /**
   * ping host and return response object
   * @param {IClientOptions} options
   */
  ping(options: IClientOptions): Promise<IClientResponse>;
}
