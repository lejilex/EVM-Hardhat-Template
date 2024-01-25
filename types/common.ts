import {ContractFactory} from "ethers";
import {ProxyContract__factory} from "typechain-types";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Deployment<T extends ContractFactory> = {
  constructorArguments?: Parameters<T["deploy"]>;
  contract: Awaited<ReturnType<T["deploy"]>>;
  contractName: string;
};

export type ProxyDeployment<T extends ContractFactory> = {
  implementation: Deployment<T>;
  proxy: Deployment<ProxyContract__factory>;
};

export enum ChainID {
  none = 0,
  ethereum = 1,
  goerli = 5,
  polygon = 137,
  hardhat = 31337,
  mumbai = 80001,
  sepolia = 11155111,
};
