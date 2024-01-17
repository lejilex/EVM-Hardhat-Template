"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smock_1 = require("@defi-wonderland/smock");
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
const typechain_types_1 = require("typechain-types");
(0, chai_1.use)(smock_1.smock.matchers);
describe("HiTest", function () {
    let deployer;
    let proxyAdmin;
    let HiFactory;
    let hi;
    before(async function () {
        [deployer, proxyAdmin] = await await hardhat_1.default.ethers.getSigners();
        HiFactory = new typechain_types_1.Hi__factory(deployer);
    });
    let snapshot;
    beforeEach(async function () {
        hi = await HiFactory.deploy();
        snapshot = await (0, hardhat_network_helpers_1.takeSnapshot)();
    });
    afterEach(async () => {
        await snapshot.restore();
    });
    describe("upon sayHi", async function () {
        it("returns the string `Hi`", async function () {
            let response = await hi.sayHi();
            (0, chai_1.expect)(response).to.equal("Hi");
        });
    });
});
