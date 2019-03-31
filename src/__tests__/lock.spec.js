const didWallet = require("../index");

const fixtures = require("./__fixtures__");

const base64url = require("base64url");

describe("lock", () => {
  it("throws when locking an empty wallet", () => {
    let wallet = didWallet.create();
    expect.assertions(1);
    try {
      wallet.lock("abc");
      const exported = wallet.export();
      console.log(exported);
    } catch (e) {
      expect(e.message).toBe("Cannot lock an empty wallet.");
    }
  });

  it("can lock and unlock", () => {
    let wallet = didWallet.create({
      keys: [
        {
          type: "assymetric",
          encoding: "hex",
          publicKey: fixtures.secp256k1_keypair_0.publicKey,
          privateKey: fixtures.secp256k1_keypair_0.privateKey,
          tags: ["did:example:456"],
          notes: ""
        }
      ]
    });
    wallet.lock("abc");
    expect(wallet.ciphered).toBeDefined();
    expect(wallet.keys).toBeUndefined();
    wallet.unlock("abc");
    expect(wallet.ciphered).toBeUndefined();
    expect(wallet.keys).toBeDefined();
  });
});
