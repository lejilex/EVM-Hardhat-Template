import { ContractFactory } from "ethers";
export declare function getContractName<T extends ContractFactory>(factory: T | {
    new (): T;
}): string;
