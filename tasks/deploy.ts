import { task } from "hardhat/config";
import { logger } from "utils";
import { isLocalNetwork, isProdNetwork } from "utils/networkHelpers";
import {
  getAddresses,
  updateAddresses,
} from "utils/manageAddresses";
import { deployLegitImpl, deployLegitAsProxy } from "utils/deployer";
import { verify } from "utils/verify";

type TaskArgs = {
  admin: string;
  owner: string;
  skipTokens: boolean;
  skipVerify: boolean;
};

task("deploy", "Will deploy the Legit Exchange as a proxy")
  .addOptionalParam(
    "admin",
    "Admin of the exchange proxy, capable of upgrading the contract. Defaults to env config `proxyAdmin` signer when not set",
  )
  .addOptionalParam(
    "owner",
    "Owner of the legit exchange owner-restricted methods, defaults to deployer",
  )
  .addFlag("skipTokens", "Will forgo setting default tokens as accepted")
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const [deployer, proxyAdmin] = await hre.ethers.getSigners();

      const admin = taskArgs.admin || proxyAdmin.address;
      const tokens = taskArgs.skipTokens
        ? []
        : [addresses.tokens.usdc, addresses.tokens.weth];
      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const legitImpl = await deployLegitImpl(deployer);

      const {contract: legitProxy, data: initData} = await deployLegitAsProxy({
        deployer: deployer,
        admin: admin,
        owner: deployer,
        router: addresses.uniswap,
        tokens: tokens,
        impl: legitImpl,
      });

      if (await isProdNetwork(hre)) {
        await legitProxy.transferOwnership(taskArgs.owner);
      }

      await updateAddresses(
        {
          LegitExchange: {
            proxy: legitProxy.address,
            implementation: legitImpl.address,
          },
        },
        hre,
      );

      if (verify_contracts) {
        await verify(hre, {
          contract: legitImpl,
          contractName: "Legit",
        });

        await verify(hre, {
          constructorArguments: [
            legitImpl.address,
            admin,
            initData
          ],
          contract: legitProxy,
          contractName: "ProxyContract",
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
