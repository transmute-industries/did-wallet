const didWallet = require("../index");

const { did_doc_jwks } = require("./__fixtures__");

describe("should be able to import jwks...", () => {
  it("can add jwk", () => {
    // console.log("yolo", did_doc_jwks);

    const privateKeyJwk = { ...did_doc_jwks.keys[1] };
    const publicKeyJwk = { ...did_doc_jwks.keys[1] };
    delete publicKeyJwk.d;

    let wallet = didWallet.create({
      keys: [
        {
          type: "assymetric",
          encoding: "jwk",
          publicKey: JSON.stringify(publicKeyJwk),
          privateKey: JSON.stringify(privateKeyJwk),
          didPublicKeyEncoding: "publicKeyJwk",
          tags: [
            "Secp256k1VerificationKey2018",
            "did:example:456#" + publicKeyJwk.kid,
            "A"
          ],
          notes: ""
        }
      ]
    });

    const key = Object.values(wallet.keys)[0];
    // NOTE: we calculate kid correctly for JWKs....
    expect(key.kid).toBe("QhxsKsp2LNvS9cNp1STyryOiOrEs6f819AGemNVN5N0");
    expect(JSON.parse(key.publicKey).kid).toBe(
      "QhxsKsp2LNvS9cNp1STyryOiOrEs6f819AGemNVN5N0"
    );
  });
});
