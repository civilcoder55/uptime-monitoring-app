/**
 * Interface for client response shape
 */
export interface IClientResponse {
  statusCode?: number | undefined; // status code of response
  responseHeaders?: Record<string, string | string[] | undefined>; // key value pairs of response headers
  timeout: boolean; // indicate if request timedout
  responseTime: number; // indicate response time in milliseconds
  error: boolean; //indicade if error happeded
  errorMessage: string; //error message
}
