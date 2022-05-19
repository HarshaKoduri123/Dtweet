require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

PRIVATE_KEY = process.env.PRIVATE_KEY
ALCHEMY_URL = process.env.ALCHEMY_URL

module.exports = {
  
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY]
    }
  },

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}