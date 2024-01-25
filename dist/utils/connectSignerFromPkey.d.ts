import { Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare function connectSignerFromPkey(pkey: string, hre: HardhatRuntimeEnvironment): Promise<Signer>;
