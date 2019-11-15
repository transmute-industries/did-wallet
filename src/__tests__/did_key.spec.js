const didWallet = require("../index");
const fixtures = require("./__fixtures__");

describe("did_key", () => {
  it("can add did_key", () => {
    let wallet = didWallet.create();
    wallet.addKey({
      type: "assymetric",
      encoding: "base58",
      didPublicKeyEncoding: "publicKeyBase58",
      publicKey: fixtures.did_key_keypair_0.publicKeyBase58,
      privateKey: fixtures.did_key_keypair_0.privateKeyBase58,
      tags: ["did:example:456", "A", fixtures.did_key_keypair_0.didDocument.id],
      notes: ""
    });
    let A = wallet.extractByTags(["A"]);
    expect(A[0].publicKey).toBe(fixtures.did_key_keypair_0.publicKeyBase58);
  });
});
