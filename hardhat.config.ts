import {HardhatUserConfig} from "hardhat/config";
import {HardhatNetworkAccountsUserConfig} from "hardhat/types";
import {envConfig, getHardhatAccounts} from "./config";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
require("tsconfig-paths/register"); // must use `require`, otherwise TS complains about missing declaration files
import "./tasks";

var hardhatAccounts: HardhatNetworkAccountsUserConfig = getHardhatAccounts(envConfig.ACCOUNTS);

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    mainnet: {
      url: envConfig.MAINNET_RPC_URL,
      accounts: envConfig.ACCOUNTS,
    },
    goerli: {
      url: envConfig.GOERLI_RPC_URL,
      accounts: envConfig.ACCOUNTS,
    },
    mumbai: {
      url: envConfig.MUMBAI_RPC_URL,
      accounts: envConfig.ACCOUNTS,
    },
    polygon: {
      url: envConfig.POLYGON_RPC_URL,
      accounts: envConfig.ACCOUNTS,
    },
    hardhat: {
      accounts: hardhatAccounts,
    },
  },
  mocha: {
    timeout: 400000,
  },
  etherscan: {
    apiKey: {
      mainnet: envConfig.ETHERSCAN_API_KEY,
      goerli: envConfig.ETHERSCAN_API_KEY,
      polygon: envConfig.POLYSCAN_API_KEY,
      polygonMumbai: envConfig.POLYSCAN_API_KEY,
    },
  },
};

export default config;
