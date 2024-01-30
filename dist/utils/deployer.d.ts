import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Legit } from "typechain-types";
export type DeployArgs = {
    deployer: SignerWithAddress;
    admin: string;
    owner: SignerWithAddress;
    router: string;
    tokens: string[];
    impl: Legit;
};
export declare function deployLegitImpl(deployer: SignerWithAddress): Promise<Legit>;
type ProxyDeployment = {
    contract: any;
    data: string;
};
export declare function deployLegitAsProxy(args: DeployArgs): Promise<ProxyDeployment>;
export {};
