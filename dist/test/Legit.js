"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smock_1 = require("@defi-wonderland/smock");
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
const utils_1 = require("utils");
const typechain_types_1 = require("typechain-types");
const test_1 = require("typechain-types/factories/contracts/test");
(0, chai_1.use)(smock_1.smock.matchers);
describe("Legit", function () {
    let deployer;
    let proxyAdmin;
    let legitImpl;
    let tokenA;
    let tokenB;
    let router;
    before(async function () {
        tokenA = await smock_1.smock.fake(new typechain_types_1.DummyERC20__factory());
        tokenB = await smock_1.smock.fake(new typechain_types_1.DummyERC20__factory());
        router = await smock_1.smock.fake(new test_1.DummyUniswapV2Router__factory());
        [deployer, proxyAdmin] = await hardhat_1.default.ethers.getSigners();
        legitImpl = await (0, utils_1.deployLegitImpl)(deployer);
    });
    let snapshot;
    let legit;
    beforeEach(async function () {
        legit = await (0, utils_1.deployLegitAsProxy)({
            deployer: deployer,
            admin: proxyAdmin.address,
            owner: deployer,
            router: router.address,
            tokens: [tokenA.address, tokenB.address],
            impl: legitImpl,
        });
        snapshot = await (0, hardhat_network_helpers_1.takeSnapshot)();
    });
    afterEach(async () => {
        await snapshot.restore();
    });
    describe("upon deployment", function () {
        it("sets the owner accordingly", async function () {
            (0, chai_1.expect)(await legit.owner()).to.equal(deployer.address);
        });
        it("sets the token approval list accordingly", async function () {
            (0, chai_1.expect)(await legit.acceptedTokens(tokenA.address)).to.be.true;
            (0, chai_1.expect)(await legit.acceptedTokens(tokenB.address)).to.be.true;
            (0, chai_1.expect)(await legit.acceptedTokens(deployer.address)).to.be.false;
        });
    });
    describe("upon modifying token acceptance", function () {
        it("can toggle token acceptance states", async function () {
            (0, chai_1.expect)(await legit.acceptedTokens(tokenA.address)).to.be.true;
            (0, chai_1.expect)(await legit.acceptedTokens(tokenB.address)).to.be.true;
            await legit
                .connect(deployer)
                .modifyTokenAcceptance(tokenA.address, false);
            (0, chai_1.expect)(await legit.acceptedTokens(tokenA.address)).to.be.false;
            (0, chai_1.expect)(await legit.acceptedTokens(tokenB.address)).to.be.true;
            await legit.connect(deployer).modifyTokenAcceptance(tokenA.address, true);
            (0, chai_1.expect)(await legit.acceptedTokens(tokenA.address)).to.be.true;
            (0, chai_1.expect)(await legit.acceptedTokens(tokenB.address)).to.be.true;
        });
    });
});
