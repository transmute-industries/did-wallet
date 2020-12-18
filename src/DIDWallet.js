const crypto = require("crypto");
const base64url = require("base64url");
const _ = require("lodash");
const keyToKID = require("./keyToKID");

const schema = require("./schema");

class DIDWallet {
  constructor(data = {}) {
    let keys = [];
    if (typeof data === "string") {
      this.ciphered = data;
      return;
    }
    if (data.keys) {
      keys = data.keys.map(k => {
        schema.validator.validate(k, schema.schemas.didWalletKey, {
          throwError: true
        });
        switch (k.type) {
          case "assymetric":
            return {
              ...k,
              kid: keyToKID(k.publicKey)
            };
          case "mnemonic":
            return {
              ...k,
              kid: keyToKID(k.mnemonic)
            };
        }
      });
    }
    this.keys = _.keyBy(keys, "kid");
  }

  lock(password) {
    let key = password;
    if (Object.keys(this.keys).length === 0) {
      throw new Error("Cannot lock an empty wallet.");
    }
    const plaintext = JSON.stringify(this.keys);
    let encrypt = crypto.createCipher("aes-256-cbc", key);
    let encrypted = encrypt.update(plaintext, "utf8", "hex");
    encrypted += encrypt.final("hex");
    this.ciphered = base64url.encode(Buffer.from(encrypted, "hex"));
    delete this.keys;
  }

  addKey(key) {
    if (!this.keys) {
      throw new Error(
        "Cannot addKey to a ciphered wallet. You must unlock first."
      );
    }

    schema.validator.validate(key, schema.schemas.didWalletKey, {
      throwError: true
    });

    let update = {};

    switch (key.type) {
      case "assymetric":
        update = {
          ...key,
          kid: keyToKID(key.publicKey)
        };
        break;
      case "mnemonic":
        update = {
          ...key,
          kid: keyToKID(key.mnemonic)
        };
        break;
    }

    this.keys = {
      ...this.keys,
      [update.kid]: update
    };
  }

  unlock(password) {
    let key = password;
    let decrypt = crypto.createDecipher("aes-256-cbc", key);
    const ciphertext = base64url.toBuffer(this.ciphered).toString("hex");
    let decrypted = decrypt.update(ciphertext, "hex", "utf8");
    decrypted += decrypt.final();
    this.keys = JSON.parse(decrypted);
    delete this.ciphered;
  }

  extractByTags(tags) {
    if (!this.keys) {
      throw new Error(
        "Cannot extractByTags from a ciphered wallet. You must unlock first."
      );
    }
    let keys = _.pickBy(this.keys, k => {
      return _.intersection(k.tags, tags).length;
    });
    return _.values(keys);
  }

  export() {
    if (this.keys) {
      throw new Error("Cannot export plaintext wallet. You must lock first.");
    }
    return this.ciphered;
  }
}

module.exports = DIDWallet;
