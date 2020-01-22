const crypto = require("crypto");
const base64url = require("base64url");

module.exports = publicKey => {
  try {
    const jwk = JSON.parse(publicKey);
    if (jwk.kid) {
      return jwk.kid;
    }
  } catch (e) {
    // do nothing
  }
  return base64url.encode(
    crypto
      .createHash("sha256")
      .update(Buffer.from(publicKey))
      .digest()
  );
};
