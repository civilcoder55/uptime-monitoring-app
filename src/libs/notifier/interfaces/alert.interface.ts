import { IClientResponse } from "../../client/interfaces/response.interface";
/**
 * Interface for alert shape
 */
export interface IAlert {
  type: AlertTypes; //alert type
  response: IClientResponse;
  host: string;
}

export enum AlertTypes {
  UP = "up",
  DOWN = "down",
}
