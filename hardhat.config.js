require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ]
  },
  networks: {
    emerald_testnet: {
      url: "https://testnet.emerald.oasis.dev",
      accounts: [
        process.env.DEPLOYER || ''
      ],
      chainId: 42261
    }
  }
};
