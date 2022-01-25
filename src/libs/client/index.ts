import { IClient } from "./interfaces/client.interface";
import { HttpClient } from "./providers/http.client";
import { HttpsClient } from "./providers/https.client";
import { TcpClient } from "./providers/tcp.client";

const httpClient = new HttpClient();
const httpsClient = new HttpsClient();
const tcpClient = new TcpClient();

export class Client {
  private providers: Map<string, IClient> = new Map();

  constructor() {
    this.providers.set("http", httpClient);
    this.providers.set("https", httpsClient);
    this.providers.set("tcp", tcpClient);
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProviderByProtocol(protocol: string): IClient {
    if (this.providers.has(protocol)) {
      return this.providers.get(protocol) as IClient;
    }
    throw new Error("provider not exists.");
  }

  addProvider(protocol: string, provider: IClient) {
    this.providers.set(protocol, provider);
  }
}
