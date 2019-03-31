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
    let encrypt = crypto.createCipher("aes256", key);
    let encrypted = encrypt.update(plaintext, "utf8", "hex");
    encrypted += encrypt.final("hex");
    this.ciphered = base64url.encode(Buffer.from(encrypted, "hex"));
    delete this.keys;
  }

  unlock(password) {
    let key = password;
    let decrypt = crypto.createDecipher("aes256", key);
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
      return (
        _.intersection(k.tags, tags).length
      );
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
