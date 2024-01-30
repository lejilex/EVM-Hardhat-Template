import { task } from "hardhat/config";
import { logger } from "utils";
import { getAddresses } from "utils/manageAddresses";
import { verify } from "utils/verify";
import {Legit__factory, ProxyContract__factory} from "typechain-types";

task("verify", "Will verify the contracts for the specified network")
  .setAction(async (_ , hre) => {
    try {
      const addresses = await getAddresses(hre);
      const [deployer, proxyAdmin] = await hre.ethers.getSigners();

      const admin = proxyAdmin.address;
      const tokens = [addresses.tokens.usdc, addresses.tokens.weth];

      let legitImpl = Legit__factory.connect(addresses.LegitExchange.implementation, deployer);
      await verify(hre, {
          contract: legitImpl,
          contractName: "Legit",
      });

      let legitProxy = ProxyContract__factory.connect(addresses.LegitExchange.proxy, deployer);
      const initData = legitImpl.interface.encodeFunctionData("initialize", [
        deployer.address,
        addresses.uniswap,
        tokens,
      ]);

      await verify(hre, {
          constructorArguments: [legitImpl.address, admin, initData],
          contract: legitProxy,
          contractName: "ProxyContract",
      });

    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
