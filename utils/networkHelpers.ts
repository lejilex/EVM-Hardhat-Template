import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ChainID } from "types";
import { logger } from "utils";

const PROD_NETWORKS = [ChainID.ethereum, ChainID.polygon];

export function isLocalNetwork(hre: HardhatRuntimeEnvironment) {
  return hre.network.name === "hardhat" || hre.network.name === "localhost";
}

export async function getChainId(
  hre: HardhatRuntimeEnvironment,
): Promise<number> {
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  if (!(chainId in ChainID)) {
    logger.out(
      `Chain ID: '${chainId}' is not among the ones we have contracts deployed to`,
    );
  }
  return chainId;
}

export async function isProdNetwork(
  hreOrChainId: HardhatRuntimeEnvironment | number,
): Promise<boolean> {
  const thisChainId =
    typeof hreOrChainId === "number"
      ? hreOrChainId
      : await getChainId(hreOrChainId);
  return PROD_NETWORKS.includes(thisChainId);
}
