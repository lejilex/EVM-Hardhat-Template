"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");
require("tsconfig-paths/register"); // must use `require`, otherwise TS complains about missing declaration files
require("./tasks");
var hardhatAccounts = (0, config_1.getHardhatAccounts)(config_1.envConfig.ACCOUNTS);
const config = {
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
            url: config_1.envConfig.MAINNET_RPC_URL,
            accounts: config_1.envConfig.ACCOUNTS,
        },
        goerli: {
            url: config_1.envConfig.GOERLI_RPC_URL,
            accounts: config_1.envConfig.ACCOUNTS,
        },
        mumbai: {
            url: config_1.envConfig.MUMBAI_RPC_URL,
            accounts: config_1.envConfig.ACCOUNTS,
        },
        polygon: {
            url: config_1.envConfig.POLYGON_RPC_URL,
            accounts: config_1.envConfig.ACCOUNTS,
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
            mainnet: config_1.envConfig.ETHERSCAN_API_KEY,
            goerli: config_1.envConfig.ETHERSCAN_API_KEY,
            polygon: config_1.envConfig.POLYSCAN_API_KEY,
            polygonMumbai: config_1.envConfig.POLYSCAN_API_KEY,
        },
    },
};
exports.default = config;
