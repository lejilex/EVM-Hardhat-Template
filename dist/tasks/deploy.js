"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const utils_1 = require("utils");
const networkHelpers_1 = require("utils/networkHelpers");
const manageAddresses_1 = require("utils/manageAddresses");
const deployer_1 = require("utils/deployer");
const verify_1 = require("utils/verify");
(0, config_1.task)("deploy", "Will deploy the Legit Exchange as a proxy")
    .addOptionalParam("admin", "Admin of the exchange proxy, capable of upgrading the contract. Defaults to env config `proxyAdmin` signer when not set")
    .addOptionalParam("owner", "Owner of the legit exchange owner-restricted methods, defaults to deployer")
    .addFlag("skipTokens", "Will forgo setting default tokens as accepted")
    .addFlag("skipVerify", "Skip contract verification")
    .setAction(async (taskArgs, hre) => {
    try {
        const addresses = await (0, manageAddresses_1.getAddresses)(hre);
        const [deployer, proxyAdmin] = await hre.ethers.getSigners();
        const admin = taskArgs.admin || proxyAdmin.address;
        const tokens = taskArgs.skipTokens
            ? []
            : [addresses.tokens.usdc, addresses.tokens.weth];
        const verify_contracts = !(0, networkHelpers_1.isLocalNetwork)(hre) && !taskArgs.skipVerify;
        const legitImpl = await (0, deployer_1.deployLegitImpl)(deployer);
        const { contract: legitProxy, data: initData } = await (0, deployer_1.deployLegitAsProxy)({
            deployer: deployer,
            admin: admin,
            owner: deployer,
            router: addresses.uniswap,
            tokens: tokens,
            impl: legitImpl,
        });
        if (await (0, networkHelpers_1.isProdNetwork)(hre)) {
            await legitProxy.transferOwnership(taskArgs.owner);
        }
        await (0, manageAddresses_1.updateAddresses)({
            LegitExchange: {
                proxy: legitProxy.address,
                implementation: legitImpl.address,
            },
        }, hre);
        if (verify_contracts) {
            await (0, verify_1.verify)(hre, {
                contract: legitImpl,
                contractName: "Legit",
            });
            await (0, verify_1.verify)(hre, {
                constructorArguments: [legitImpl.address, admin, initData],
                contract: legitProxy,
                contractName: "ProxyContract",
            });
        }
    }
    catch (error) {
        utils_1.logger.out(error, utils_1.logger.Level.Error);
    }
});
