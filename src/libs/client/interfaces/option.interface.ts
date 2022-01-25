/**
 * Interface for client options shape
 */
export interface IClientOptions {
  host: string; // host ip or url
  protocol: string; // host protocol (http,https,tcp)
  timeout: number; // timeout in seconds
  path?: string; // optional path for http or https
  httpHeaders?: Record<string, string | string[] | undefined>; // key value pairs of http headers
  ignoreSSL?: boolean;
  port?: number; // host port
}
