import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeepPartial } from "types";
import { AddressObj } from "./types";
/**
 * Removes contract address for the current network from the appropriate file.
 */
export declare function resetContractAddresses(hre: HardhatRuntimeEnvironment, filePath?: string): Promise<void>;
export declare function getAddresses(hre: HardhatRuntimeEnvironment, filePath?: string): Promise<AddressObj>;
export declare function updateAddresses(partial: DeepPartial<AddressObj>, hre: HardhatRuntimeEnvironment, filePath?: string): Promise<void>;
