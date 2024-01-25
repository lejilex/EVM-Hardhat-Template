"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainID = void 0;
var ChainID;
(function (ChainID) {
    ChainID[ChainID["none"] = 0] = "none";
    ChainID[ChainID["ethereum"] = 1] = "ethereum";
    ChainID[ChainID["goerli"] = 5] = "goerli";
    ChainID[ChainID["polygon"] = 137] = "polygon";
    ChainID[ChainID["hardhat"] = 31337] = "hardhat";
    ChainID[ChainID["mumbai"] = 80001] = "mumbai";
})(ChainID || (exports.ChainID = ChainID = {}));
;
