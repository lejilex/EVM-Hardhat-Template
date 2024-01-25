"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractName = void 0;
function getContractName(factory) {
    const factoryName = "name" in factory ? factory.name : factory.constructor.name;
    return factoryName.replace("__factory", "");
}
exports.getContractName = getContractName;
