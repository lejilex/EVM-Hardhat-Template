import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare function isLocalNetwork(hre: HardhatRuntimeEnvironment): boolean;
export declare function getChainId(hre: HardhatRuntimeEnvironment): Promise<number>;
export declare function isProdNetwork(hreOrChainId: HardhatRuntimeEnvironment | number): Promise<boolean>;
