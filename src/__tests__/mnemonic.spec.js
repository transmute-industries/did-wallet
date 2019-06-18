const didWallet = require("../index");
const fixtures = require("./__fixtures__");

describe("mnemonic", () => {
  it("can add mnemonic", () => {
    let wallet = didWallet.create();
    wallet.addKey({
      type: "mnemonic",
      encoding: "bip39",
      mnemonic: fixtures.bip39_mnemonic_0,
      tags: ["did:example:456", "A"],
      notes: ""
    });
    let A = wallet.extractByTags(["A"]);
    expect(A[0].mnemonic).toBe(fixtures.bip39_mnemonic_0);
  });
});
