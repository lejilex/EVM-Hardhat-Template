import { ChainID } from "types";
import { AddressObj } from "./types";
export declare function getAddressesByNetworkId(networkId: string | symbol | number | ChainID, filePath?: string): AddressObj;
export declare function readAllAddresses(filePath?: string): Record<string, AddressObj>;
export declare function saveFrontendFiles(addresses: Record<string, AddressObj>, filePath?: string): void;
export declare function createEmptyAddressObj(): AddressObj;
