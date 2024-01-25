import { FakeContract, smock } from "@defi-wonderland/smock";
import {
  SnapshotRestorer,
  takeSnapshot,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect, use } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";

import {
  connectSignerFromPkey,
  deployLegitAsProxy,
  deployLegitImpl,
  genWallet,
} from "utils";
import { DummyERC20, DummyERC20__factory, Legit } from "typechain-types";
import { DummyUniswapV2Router } from "typechain-types/contracts/test";
import { DummyUniswapV2Router__factory } from "typechain-types/factories/contracts/test";

use(smock.matchers);

describe("Legit", function () {
  let deployer: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let legitImpl: Legit;
  let tokenA: FakeContract<DummyERC20>;
  let tokenB: FakeContract<DummyERC20>;
  let router: FakeContract<DummyUniswapV2Router>;

  before(async function () {
    tokenA = await smock.fake<DummyERC20>(new DummyERC20__factory());
    tokenB = await smock.fake<DummyERC20>(new DummyERC20__factory());
    router = await smock.fake<DummyUniswapV2Router>(
      new DummyUniswapV2Router__factory(),
    );

    [deployer, proxyAdmin] = await hre.ethers.getSigners();
    legitImpl = await deployLegitImpl(deployer);
  });

  let snapshot: SnapshotRestorer;
  let legit: Legit;

  beforeEach(async function () {
    legit = await deployLegitAsProxy({
      deployer: deployer,
      admin: proxyAdmin.address,
      owner: deployer,
      router: router.address,
      tokens: [tokenA.address, tokenB.address],
      impl: legitImpl,
    });
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
});
