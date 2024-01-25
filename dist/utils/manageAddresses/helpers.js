"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyAddressObj = exports.saveFrontendFiles = exports.readAllAddresses = exports.getAddressesByNetworkId = void 0;
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("types/constants");
function getAddressesByNetworkId(networkId, filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    const addresses = readAllAddresses(filePath);
    const key = String(networkId);
    if (!hasKey(addresses, key)) {
        throw new Error(`Missing address object for network ${key} in address file`);
    }
    return new Proxy(addresses[key], {
        get: (target, prop, receiver) => {
            const contractKey = String(prop);
            // If the Proxy is awaited, it's converted into a "thenable" object, so we need return the now-thenable object's "then" property
            // Useful links:
            // - Official docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description
            // - Issue on SO: https://stackoverflow.com/questions/48318843/why-does-await-trigger-then-on-a-proxy-returned-by-an-async-function?rq=3
            if (contractKey === "then") {
                return Reflect.get(target, prop, receiver);
            }
            if (hasKey(target, contractKey)) {
                return target[contractKey];
            }
            throw new Error(`Contract '${contractKey}' not deployed on network '${key}'`);
        },
    });
}
exports.getAddressesByNetworkId = getAddressesByNetworkId;
function readAllAddresses(filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    checkExistence(filePath);
    const jsonData = fs_1.default.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);
    return data;
}
exports.readAllAddresses = readAllAddresses;
function saveFrontendFiles(addresses, filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    checkExistence(filePath);
    const data = readAllAddresses(filePath);
    Object.assign(data, addresses);
    fs_1.default.writeFileSync(filePath, `${JSON.stringify(data, undefined, 2)}\n`);
}
exports.saveFrontendFiles = saveFrontendFiles;
function checkExistence(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`No such file, path: '${filePath}'.`);
    }
}
function hasKey(obj, k) {
    return k in obj;
}
function createEmptyAddressObj() {
    return {
        LegitExchange: {
            implementation: "",
            proxy: "",
        },
        uniswap: "",
        tokens: {
            usdc: "",
            weth: "",
        },
    };
}
exports.createEmptyAddressObj = createEmptyAddressObj;
