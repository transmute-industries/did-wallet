const didWallet = require("../index");

const fixtures = require("./__fixtures__");

describe("export", () => {
  it("throws when exporting plaintext", () => {
    let wallet = didWallet.create();
    expect.assertions(1);
    try {
      const exported = wallet.export();
    } catch (e) {
      expect(e.message).toBe(
        "Cannot export plaintext wallet. You must lock first."
      );
    }
  });

  it("can export a locked wallet", () => {
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
    const exported = wallet.export();
    expect(exported).toBe(fixtures.exported_wallet_0);
  });

  it("can import a locked wallet", () => {
    let wallet = didWallet.create(fixtures.exported_wallet_0);
    wallet.unlock("abc");
    expect(wallet.keys).toBeDefined();
  });
});
