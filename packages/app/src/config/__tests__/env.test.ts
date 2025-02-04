import { getApiKeys, isDebugMode } from "../env";

describe("config/env", () => {
  beforeAll(() => {
    process.env.INFURA_API_KEY = "infura";
    process.env.ALCHEMY_API_KEY = "alchemy";
    process.env.FREIGHT_TRUST_NETWORK = "freightTrustNetwork";
    process.env.PULSECHAIN_API_KEY = "pulseChain";
    process.env.CRYPTKEEPER_DEBUG = "false";
  });

  afterAll(() => {
    delete process.env.INFURA_API_KEY;
    delete process.env.ALCHEMY_API_KEY;
    delete process.env.FREIGHT_TRUST_NETWORK;
    delete process.env.PULSECHAIN_API_KEY;
    delete process.env.CRYPTKEEPER_DEBUG;
  });

  test("should return env api config", () => {
    const apiKeys = getApiKeys();

    expect(apiKeys).toStrictEqual({
      infura: "infura",
      alchemy: "alchemy",
      freightTrustNetwork: "freightTrustNetwork",
      pulseChain: "pulseChain",
    });
  });

  test("should check if debug mode is enabled", () => {
    expect(isDebugMode()).toBe(false);
  });
});
