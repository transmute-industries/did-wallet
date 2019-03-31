const DIDWallet = require("./DIDWallet");

const create = data => {
  return new DIDWallet(data);
};

module.exports = {
  create
};
