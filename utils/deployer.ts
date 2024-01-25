import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Legit, Legit__factory, ProxyContract__factory } from "typechain-types";

export type DeployArgs = {
  deployer: SignerWithAddress;
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  router: string;
  tokens: string[];
  impl: Legit;
};

export async function deployLegitImpl(
  deployer: SignerWithAddress,
): Promise<Legit> {
  const LegitFactory = new Legit__factory(deployer);
  const LegitImpl = await LegitFactory.deploy();
  await LegitImpl.deployed();
  return LegitImpl;
}

export async function deployLegitAsProxy(args: DeployArgs): Promise<Legit> {
  const ProxyFactory = new ProxyContract__factory(args.deployer);
  const InitData = args.impl.interface.encodeFunctionData("initialize", [
    args.owner.address,
    args.router,
    args.tokens,
  ]);

  const LegitProxy = await ProxyFactory.deploy(
    args.impl.address,
    args.admin.address,
    InitData,
  );

  await LegitProxy.deployed();

  return Legit__factory.connect(LegitProxy.address, args.owner);
}
