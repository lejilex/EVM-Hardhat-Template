"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const _1 = require(".");
/**
 * Verifies contract on Etherscan-like explorer.
 *
 * NOTE: Always verify implementation first and then proxy, because otherwise 'verify' task
 * passes proxy's ctor args as if they are implementation's, causing verification to fail.
 *
 * @param hre HardhatRuntimeEnvironment
 * @param deployment Deployment<T> data
 */
async function verify(hre, deployment) {
    try {
        const { contract: { address }, contractName, constructorArguments, } = deployment;
        _1.logger.out(`Verifying ${contractName} at: ${address}...`);
        let promises = [];
        promises.push(hre.run("verify:verify", {
            address,
            constructorArguments,
            contractName,
        }));
        await Promise.allSettled(promises);
    }
    catch (error) {
        _1.logger.out(error, _1.logger.Level.Warn);
    }
}
exports.verify = verify;
