"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProdNetwork = exports.getChainId = exports.isLocalNetwork = void 0;
const types_1 = require("types");
const utils_1 = require("utils");
const PROD_NETWORKS = [types_1.ChainID.ethereum, types_1.ChainID.polygon];
function isLocalNetwork(hre) {
    return hre.network.name === "hardhat" || hre.network.name === "localhost";
}
exports.isLocalNetwork = isLocalNetwork;
async function getChainId(hre) {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId;
    if (!(chainId in types_1.ChainID)) {
        utils_1.logger.out(`Chain ID: '${chainId}' is not among the ones we have contracts deployed to`);
    }
    return chainId;
}
exports.getChainId = getChainId;
async function isProdNetwork(hreOrChainId) {
    const thisChainId = typeof hreOrChainId === "number" ? hreOrChainId : await getChainId(hreOrChainId);
    return PROD_NETWORKS.includes(thisChainId);
}
exports.isProdNetwork = isProdNetwork;
