"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployLegitAsProxy = exports.deployLegitImpl = void 0;
const typechain_types_1 = require("typechain-types");
async function deployLegitImpl(deployer) {
    const LegitFactory = new typechain_types_1.Legit__factory(deployer);
    const LegitImpl = await LegitFactory.deploy();
    await LegitImpl.deployed();
    return LegitImpl;
}
exports.deployLegitImpl = deployLegitImpl;
async function deployLegitAsProxy(args) {
    const ProxyFactory = new typechain_types_1.ProxyContract__factory(args.deployer);
    const InitData = args.impl.interface.encodeFunctionData("initialize", [
        args.owner.address,
        args.router,
        args.tokens,
    ]);
    const LegitProxy = await ProxyFactory.deploy(args.impl.address, args.admin, InitData);
    await LegitProxy.deployed();
    return typechain_types_1.Legit__factory.connect(LegitProxy.address, args.owner);
}
exports.deployLegitAsProxy = deployLegitAsProxy;
