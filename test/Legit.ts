import { FakeContract, smock } from "@defi-wonderland/smock";
import {
  SnapshotRestorer,
  takeSnapshot,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect, use } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import { deployLegitAsProxy, deployLegitImpl, encodePath } from "utils";
import {
  DummyERC20,
  DummyERC20__factory,
  DummyUniswapV3Router,
  DummyUniswapV3Router__factory,
  Legit,
} from "typechain-types";

use(smock.matchers);

describe("Legit", function () {
  let deployer: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let legitImpl: Legit;
  let tokenA: FakeContract<DummyERC20>;
  let tokenB: FakeContract<DummyERC20>;
  let router: FakeContract<DummyUniswapV3Router>;

  before(async function () {
    tokenA = await smock.fake<DummyERC20>(new DummyERC20__factory());
    tokenB = await smock.fake<DummyERC20>(new DummyERC20__factory());
    router = await smock.fake<DummyUniswapV3Router>(
      new DummyUniswapV3Router__factory(),
    );

    [deployer, proxyAdmin] = await hre.ethers.getSigners();
    legitImpl = await deployLegitImpl(deployer);
  });

  let snapshot: SnapshotRestorer;
  let legit: Legit;

  beforeEach(async function () {
    const deployment = await deployLegitAsProxy({
      deployer: deployer,
      admin: proxyAdmin.address,
      owner: deployer,
      router: router.address,
      tokens: [tokenA.address, tokenB.address],
      impl: legitImpl,
    });
    legit = deployment.contract;
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("upon deployment", function () {
    it("sets the owner accordingly", async function () {
      expect(await legit.owner()).to.equal(deployer.address);
    });

    it("sets the token approval list accordingly", async function () {
      expect(await legit.acceptedTokens(tokenA.address)).to.be.true;
      expect(await legit.acceptedTokens(tokenB.address)).to.be.true;
      expect(await legit.acceptedTokens(deployer.address)).to.be.false;
    });
  });

  describe("upon modifying token acceptance", function () {
    it("can toggle token acceptance states", async function () {
      expect(await legit.acceptedTokens(tokenA.address)).to.be.true;
      expect(await legit.acceptedTokens(tokenB.address)).to.be.true;
      await legit
        .connect(deployer)
        .modifyTokenAcceptance(tokenA.address, false);
      expect(await legit.acceptedTokens(tokenA.address)).to.be.false;
      expect(await legit.acceptedTokens(tokenB.address)).to.be.true;
      await legit.connect(deployer).modifyTokenAcceptance(tokenA.address, true);
      expect(await legit.acceptedTokens(tokenA.address)).to.be.true;
      expect(await legit.acceptedTokens(tokenB.address)).to.be.true;
    });
  });

  describe("upon calling swapInExactV3", function () {
    it("reverts when paused", async function () {
      await legit.pause();
      await expect(legit.swapInExactV3(0, 0, "0x00")).to.be.revertedWith(
        "Pausable: paused",
      );
    });

    it("reverts if the first token is unaccepted", async function () {
      let PATH = encodePath([tokenA.address, tokenB.address], [0]);
      await legit.modifyTokenAcceptance(tokenA.address, false);
      await expect(
        legit.swapInExactV3(0, 0, PATH),
      ).to.be.revertedWithCustomError(legit, "UnacceptedToken");
    });

    it("reverts if the third token is unaccepted", async function () {
      let PATH = encodePath(
        [tokenA.address, tokenB.address, tokenA.address],
        [0, 0],
      );
      await legit.modifyTokenAcceptance(tokenA.address, false);
      await expect(
        legit.swapInExactV3(0, 0, PATH),
      ).to.be.revertedWithCustomError(legit, "UnacceptedToken");
    });

    it("correctly calls the router and emits the Swap event", async function () {
      let PATH = encodePath([tokenA.address, tokenB.address], [10]);
      router.exactInput.returns(49);
      await expect(legit.swapInExactV3(100, 50, PATH))
        .to.emit(legit, "Swap")
        .withArgs(PATH, 100, 49);
    });
  });

  describe("upon calling swapOutExactV3", function () {
    it("reverts when paused", async function () {
      await legit.pause();
      await expect(legit.swapOutExactV3(0, 0, "0x00")).to.be.revertedWith(
        "Pausable: paused",
      );
    });

    it("reverts if the first token is unaccepted", async function () {
      let PATH = encodePath([tokenA.address, tokenB.address], [0]);
      await legit.modifyTokenAcceptance(tokenA.address, false);
      await expect(
        legit.swapOutExactV3(0, 0, PATH),
      ).to.be.revertedWithCustomError(legit, "UnacceptedToken");
    });

    it("reverts if the third token is unaccepted", async function () {
      let PATH = encodePath(
        [tokenA.address, tokenB.address, tokenA.address],
        [0, 0],
      );
      await legit.modifyTokenAcceptance(tokenA.address, false);
      await expect(
        legit.swapOutExactV3(0, 0, PATH),
      ).to.be.revertedWithCustomError(legit, "UnacceptedToken");
    });

    it("correctly calls the router and emits the Swap event", async function () {
      let PATH = encodePath([tokenA.address, tokenB.address], [10]);
      router.exactOutput.returns(99);
      await expect(legit.swapOutExactV3(50, 100, PATH))
        .to.emit(legit, "Swap")
        .withArgs(PATH, 99, 50);
    });
  });
});
