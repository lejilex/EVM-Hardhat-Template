import { ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployment } from "types";
/**
 * Verifies contract on Etherscan-like explorer.
 *
 * NOTE: Always verify implementation first and then proxy, because otherwise 'verify' task
 * passes proxy's ctor args as if they are implementation's, causing verification to fail.
 *
 * @param hre HardhatRuntimeEnvironment
 * @param deployment Deployment<T> data
 */
export declare function verify<T extends ContractFactory>(hre: HardhatRuntimeEnvironment, deployment: Deployment<T>): Promise<void>;
