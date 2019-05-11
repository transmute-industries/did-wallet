# @transmute/did-wallet

```
npm i @transmute/did-wallet --save
```

🚧 Under Construction.

<p align="center">
  <img src="./transmute-banner.png"/>
</p>

### Description

A simple javascript based key store built for DID and JSON-LD Signatures.

### Usage

Creating, locking and exporting...

```js
const wallet = didWallet.create({
  keys: [
    {
      type: "assymetric",
      encoding: "hex",
      publicKey: "1111...",
      privateKey: "222...",
      tags: ["Secp256k1VerificationKey2018", "did:example:123", "WebBrowser"],
      notes: ""
    },
    {
      type: "assymetric",
      encoding: "hex",
      publicKey: "3333...",
      privateKey: "4444...",
      tags: ["Secp256k1VerificationKey2018", "did:example:456", "OfflineOnly"],
      notes: ""
    }
  ]
});
wallet.lock("hard-to-guess-password");
const exported = wallet.export();
```

Importing, unlocking, and extracting...

```js
const wallet = didWallet.create("l2aUGWXsaiRN_aANnXi9...");
wallet.unlock("hard-to-guess-password");

const onlyWebKeys = wallet.extractByTags(["WebBrowser"]);
let webWallet = didWallet.create({
  keys: [...onlyWebKeys]
});
```

## Encoding and Standards

- https://tools.ietf.org/html/rfc3156

## Developing

```
npm i
npm run test
```