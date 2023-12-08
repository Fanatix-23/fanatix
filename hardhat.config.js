require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
const API_URL_MUMBAI = process.env.API_URL_MUMBAI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL_MAINNET = process.env.API_URL_MAINNET;
const API_URL_SMART_CHAIN_TESTNET = process.env.API_URL_SMART_CHAIN_TESTNET;
const API_URL_SMART_CHAIN = process.env.API_URL_SMART_CHAIN;
const API_URL_SEPOLIA = process.env.API_URL_SEPOLIA;

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    }
  },
  defaultNetwork: "polygon_mumbai",
   networks: {
      hardhat: {},
      polygon_mumbai: {
         url: API_URL_MUMBAI,
         accounts: [`0x${PRIVATE_KEY}`],
         chainId: 80001,
      },
      polygon_mainnet : {
         url : API_URL_MAINNET,
         accounts : [`0x${PRIVATE_KEY}`],
         chainId : 137,
      }
    },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [':ERC20$'],
  },
};
