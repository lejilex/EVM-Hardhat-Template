"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONTRACT_ADDRESS_FILE_PATH = exports.ADDRESS_ZERO = void 0;
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const path_1 = __importDefault(require("path"));
exports.DEFAULT_CONTRACT_ADDRESS_FILE_PATH = path_1.default.join(__dirname, "../contract-address.json");
