const didWallet = require("../index");

const fixtures = require("./__fixtures__");

describe("addKey", () => {
  it("can addKey to empty wallet", () => {
    let wallet = didWallet.create();
    expect(wallet.keys).toEqual({});

    wallet.addKey({
      type: "assymetric",
      encoding: "hex",
      publicKey: fixtures.secp256k1_keypair_0.publicKey,
      privateKey: fixtures.secp256k1_keypair_0.privateKey,
      tags: ["Secp256k1VerificationKey2018", "did:example:456", "A"],
      notes: ""
    });

    expect(wallet.keys).toMatchSnapshot();
  });

  it("can addKey to existing wallet", () => {
    let wallet = didWallet.create({
      keys: [
        {
          type: "assymetric",
          encoding: "hex",
          publicKey: fixtures.secp256k1_keypair_0.publicKey,
          privateKey: fixtures.secp256k1_keypair_0.privateKey,
          tags: ["Secp256k1VerificationKey2018", "did:example:456", "A"],
          notes: ""
        }
      ]
    });

    expect(wallet.keys).toMatchSnapshot();

    wallet.addKey({
      type: "assymetric",
      encoding: "application/pgp-keys",
      publicKey: fixtures.openpgpg_keypair_1.publicKey,
      privateKey: fixtures.openpgpg_keypair_1.privateKey,
      revocationCertificate: fixtures.openpgpg_keypair_1.revocationCertificate,
      tags: ["Secp256k1VerificationKey2018", "did:example:456", "A"],
      notes: ""
    });

    expect(wallet.keys).toMatchSnapshot();
  });
});
