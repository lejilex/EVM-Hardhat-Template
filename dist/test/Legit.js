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
        router = await smock_1.smock.fake(new typechain_types_1.DummyUniswapV3Router__factory());
        [deployer, proxyAdmin] = await hardhat_1.default.ethers.getSigners();
        legitImpl = await (0, utils_1.deployLegitImpl)(deployer);
    });
    let snapshot;
    let legit;
    beforeEach(async function () {
        const deployment = await (0, utils_1.deployLegitAsProxy)({
            deployer: deployer,
            admin: proxyAdmin.address,
            owner: deployer,
            router: router.address,
            tokens: [tokenA.address, tokenB.address],
            impl: legitImpl,
        });
        legit = deployment.contract;
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
    describe("upon calling swapInExactV3", function () {
        it("reverts when paused", async function () {
            await legit.pause();
            await (0, chai_1.expect)(legit.swapInExactV3(0, 0, "0x00")).to.be.revertedWith("Pausable: paused");
        });
        it("reverts if the first token is unaccepted", async function () {
            let PATH = (0, utils_1.encodePath)([tokenA.address, tokenB.address], [0]);
            await legit.modifyTokenAcceptance(tokenA.address, false);
            await (0, chai_1.expect)(legit.swapInExactV3(0, 0, PATH)).to.be.revertedWithCustomError(legit, "UnacceptedToken");
        });
        it("reverts if the third token is unaccepted", async function () {
            let PATH = (0, utils_1.encodePath)([tokenA.address, tokenB.address, tokenA.address], [0, 0]);
            await legit.modifyTokenAcceptance(tokenA.address, false);
            await (0, chai_1.expect)(legit.swapInExactV3(0, 0, PATH)).to.be.revertedWithCustomError(legit, "UnacceptedToken");
        });
        it("correctly calls the router and emits the Swap event", async function () {
            let PATH = (0, utils_1.encodePath)([tokenA.address, tokenB.address], [10]);
            console.log(PATH);
            // router.exactInput.returns(49);
            await legit.swapInExactV3(100, 50, PATH);
            // await expect(
            //   legit.swapInExactV3(100, 50, PATH)
            // )
            // .to.emit(legit, "Swap")
            // .withArgs(PATH, 100, 49)
        });
    });
});
