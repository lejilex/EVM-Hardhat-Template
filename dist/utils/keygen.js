"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genWallet = void 0;
const crypto = __importStar(require("crypto"));
const ethers_1 = require("ethers");
const logger_1 = require("./logger");
function genWallet(printToConsole = false) {
    var id = crypto.randomBytes(32).toString("hex");
    var privateKey = "0x" + id;
    var wallet = new ethers_1.ethers.Wallet(privateKey);
    if (printToConsole) {
        (0, logger_1.pad)(10, "PKEY:", privateKey);
        (0, logger_1.pad)(10, "Address: " + wallet.address);
    }
    return wallet;
}
exports.genWallet = genWallet;
