const crypto = require("crypto");
const base64url = require("base64url");

module.exports = publicKey => {
  return base64url.encode(
    crypto
      .createHash("sha256")
      .update(Buffer.from(publicKey))
      .digest()
  );
};
