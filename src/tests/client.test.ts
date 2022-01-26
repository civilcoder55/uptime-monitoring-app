import { Client } from "../libs/client";
import { HttpClient } from "../libs/client/providers/http.client";
import nock from "nock";

const client = new Client();
const httpClient = new HttpClient();

test("Should make client instance", () => {
  const providers = client.getProviders();
  expect(providers).toEqual(["http", "https", "tcp"]);
});

test("Should get provider by protocol", () => {
  const provider = client.getProviderByProtocol("http");
  expect(provider).not.toBeNull();
  expect(provider).toBeInstanceOf(HttpClient);
});

const mockedUdpClient = {
  ping: jest.fn(),
};

test("Should add custom provider ", () => {
  client.addProvider("udp", mockedUdpClient);
  const providers = client.getProviders();
  expect(providers).toEqual(["http", "https", "tcp", "udp"]);
});

describe("https client provider", () => {
  nock("http://www.example.com").get("/valid").reply(200);
  nock("http://www.example.com")
    .defaultReplyHeaders({
      "x-test": (req) => req.getHeader("x-test") as string,
    })
    .get("/headers")
    .reply(200);

  nock("http://www.example.com").get("/timeout").delayConnection(7000).reply(200);
  nock("http://www.example.com").get("/invalid").replyWithError("something awful happened");

  test("Should make valid http call ", async () => {
    const response = await httpClient.ping({
      host: "www.example.com",
      protocol: "http",
      path: "/valid",
      timeout: 5, // in seconds
    });

    expect(response.statusCode).toEqual(200);
    expect(response.error).toBeFalsy();
    expect(response.errorMessage).toBeFalsy();
    expect(response.timeout).toBeFalsy();
    expect(response.responseTime).toEqual(expect.any(Number));
  });

  jest.setTimeout(10000);

  test("Should return timeout http call ", async () => {
    const response = await httpClient.ping({
      host: "www.example.com",
      protocol: "http",
      path: "/timeout",
      timeout: 5,
    });

    expect(response.statusCode).toBeUndefined();
    expect(response.error).toBeTruthy();
    expect(response.errorMessage).toBeUndefined();
    expect(response.timeout).toBeTruthy();
    expect(response.responseTime).toBeUndefined();
  });

  test("Should make invalid http call ", async () => {
    const response = await httpClient.ping({
      host: "www.example.com",
      protocol: "http",
      path: "/invalid",
      timeout: 5,
    });

    expect(response.statusCode).toBeUndefined();
    expect(response.error).toBeTruthy();
    expect(response.errorMessage).toEqual("something awful happened");
    expect(response.timeout).toBeFalsy();
    expect(response.responseTime).toBeUndefined();
  });

  test("Should send http headers", async () => {
    const response = await httpClient.ping({
      host: "www.example.com",
      protocol: "http",
      httpHeaders: {
        "x-test": "test value",
      },
      path: "/headers",
      timeout: 5,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.responseHeaders).not.toBeUndefined();
    expect(response.responseHeaders?.["x-test"]).toEqual("test value");
    expect(response.error).toBeFalsy();
    expect(response.errorMessage).toBeFalsy();
    expect(response.timeout).toBeFalsy();
    expect(response.responseTime).toEqual(expect.any(Number));
  });
});
