"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = exports.getHardhatAccounts = void 0;
// Env handling:
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, "../.env") });
const DEPLOYER_KEY = extractString("DEPLOYER_KEY");
const PROXY_ADMIN_KEY = extractString("PROXY_ADMIN_KEY");
const ETHERSCAN_API_KEY = extractString("ETHERSCAN_API_KEY");
const GOERLI_RPC_URL = extractString("GOERLI_RPC_URL");
const GANACHE_RPC_URL = extractString("GANACHE_RPC_URL");
const MAINNET_RPC_URL = extractString("MAINNET_RPC_URL");
const MUMBAI_RPC_URL = extractString("MUMBAI_RPC_URL");
const POLYGON_RPC_URL = extractString("POLYGON_RPC_URL");
const POLYSCAN_API_KEY = extractString("POLYSCAN_API_KEY");
function extractString(name) {
    const envVar = process.env[name];
    if (!envVar) {
        throw new Error(`Please add the ${name} key to your .env file`);
    }
    return envVar;
}
function getHardhatAccounts(accountList) {
    const hardhatAccounts = accountList.map((element) => ({
        privateKey: element,
        balance: "1000000000000000000000",
    }));
    return hardhatAccounts;
}
exports.getHardhatAccounts = getHardhatAccounts;
exports.envConfig = {
    ETHERSCAN_API_KEY,
    GANACHE_RPC_URL,
    GOERLI_RPC_URL,
    MAINNET_RPC_URL,
    MUMBAI_RPC_URL,
    POLYGON_RPC_URL,
    POLYSCAN_API_KEY,
    ACCOUNTS: [DEPLOYER_KEY, PROXY_ADMIN_KEY],
};
