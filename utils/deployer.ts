import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Legit, Legit__factory, ProxyContract__factory } from "typechain-types";

export type DeployArgs = {
  deployer: SignerWithAddress;
  admin: string;
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

type ProxyDeployment = {
  contract: any,
  data: string
}

export async function deployLegitAsProxy(args: DeployArgs): Promise<ProxyDeployment> {
  const ProxyFactory = new ProxyContract__factory(args.deployer);
  const InitData = args.impl.interface.encodeFunctionData("initialize", [
    args.owner.address,
    args.router,
    args.tokens,
  ]);

  const LegitProxy = await ProxyFactory.deploy(
    args.impl.address,
    args.admin,
    InitData,
  );

  await LegitProxy.deployed();

  return {
    contract: Legit__factory.connect(LegitProxy.address, args.owner),
    data: InitData
  };
}
