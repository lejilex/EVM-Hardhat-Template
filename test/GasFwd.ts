import {FakeContract, smock} from "@defi-wonderland/smock";
import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect, use} from "chai";
import {Signer} from "ethers";
import hre from "hardhat";
import {
  Hi,
  Hi__factory
} from "typechain-types";

use(smock.matchers);

describe("HiTest", function () {

  let deployer: Signer;
  let proxyAdmin: Signer;
  let HiFactory: Hi__factory;
  let hi: Hi;

  before(async function () {
    [deployer, proxyAdmin] = await await hre.ethers.getSigners();
    HiFactory = new Hi__factory(deployer);
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async function () {
    hi = await HiFactory.deploy()
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("upon sayHi", async function () {
    it("returns the string `Hi`", async function () {
      let response = await hi.sayHi();
      expect(response).to.equal("Hi")
    });
  });
});
