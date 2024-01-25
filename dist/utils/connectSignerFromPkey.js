"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSignerFromPkey = void 0;
const ethers_1 = require("ethers");
async function connectSignerFromPkey(pkey, hre) {
    return new ethers_1.Wallet(pkey, hre.ethers.provider);
}
exports.connectSignerFromPkey = connectSignerFromPkey;
