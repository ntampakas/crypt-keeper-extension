import omit from "lodash/omit";

import { createNewIdentity } from "..";

describe("identity/factory", () => {
  test("should return new interrep identity ", () => {
    const defaultArgs = {
      identityStrategy: "interrep" as const,
      name: "name",
      account: "account",
      messageSignature: "signature",
      web2Provider: "github" as const,
      groups: [],
      host: "http://localhost:3000",
    };

    const identity = createNewIdentity("interrep", defaultArgs);

    expect(identity.metadata).toStrictEqual(omit(defaultArgs, ["messageSignature"]));
  });

  test("should return new random identity ", () => {
    const defaultArgs = {
      identityStrategy: "random" as const,
      name: "name",
      account: "account",
      messageSignature: "signature",
      groups: [],
      host: "http://localhost:3000",
    };

    const identity = createNewIdentity("random", defaultArgs);

    expect(identity.metadata).toStrictEqual(omit(defaultArgs, ["messageSignature"]));
  });
});
