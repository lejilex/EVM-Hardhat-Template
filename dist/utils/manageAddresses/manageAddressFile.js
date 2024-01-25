"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddresses = exports.getAddresses = exports.resetContractAddresses = void 0;
const constants_1 = require("types/constants");
const networkHelpers_1 = require("../networkHelpers");
const helpers_1 = require("./helpers");
/**
 * Removes contract address for the current network from the appropriate file.
 */
async function resetContractAddresses(hre, filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    const chainId = await (0, networkHelpers_1.getChainId)(hre);
    const emptyAddressObj = (0, helpers_1.createEmptyAddressObj)();
    if ((0, networkHelpers_1.isLocalNetwork)(hre)) {
        return (0, helpers_1.saveFrontendFiles)({ [chainId]: emptyAddressObj }, filePath);
    }
    const currentAddressObj = (0, helpers_1.getAddressesByNetworkId)(chainId, filePath);
    const cleaned = {
        ...emptyAddressObj,
        tokens: { ...currentAddressObj.tokens, },
        uniswap: currentAddressObj.uniswap,
    };
    (0, helpers_1.saveFrontendFiles)({ [chainId]: cleaned }, filePath);
}
exports.resetContractAddresses = resetContractAddresses;
async function getAddresses(hre, filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    const chainId = await (0, networkHelpers_1.getChainId)(hre);
    return (0, helpers_1.getAddressesByNetworkId)(chainId, filePath);
}
exports.getAddresses = getAddresses;
async function updateAddresses(partial, hre, filePath = constants_1.DEFAULT_CONTRACT_ADDRESS_FILE_PATH) {
    const chainId = await (0, networkHelpers_1.getChainId)(hre);
    const currentAddressObj = (0, helpers_1.getAddressesByNetworkId)(chainId, filePath);
    const updated = updateInternal(currentAddressObj, partial);
    (0, helpers_1.saveFrontendFiles)({ [chainId]: updated }, filePath);
}
exports.updateAddresses = updateAddresses;
function updateInternal(original, partial) {
    // if value to update is not an object, no need to go deeper
    if (typeof partial !== "object") {
        return partial;
    }
    const updated = { ...original };
    for (const key in partial) {
        updated[key] = updateInternal(original[key], partial[key]);
    }
    return updated;
}
