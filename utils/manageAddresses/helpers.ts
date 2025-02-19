import fs from "fs";
import { ChainID } from "types";
import { DEFAULT_CONTRACT_ADDRESS_FILE_PATH } from "types/constants";
import { AddressObj } from "./types";

export function getAddressesByNetworkId(
  networkId: string | symbol | number | ChainID,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH,
): AddressObj {
  const addresses = readAllAddresses(filePath);

  const key = String(networkId);

  if (!hasKey(addresses, key)) {
    throw new Error(
      `Missing address object for network ${key} in address file`,
    );
  }

  return new Proxy(addresses[key], {
    get: (target, prop, receiver) => {
      const contractKey = String(prop);

      // If the Proxy is awaited, it's converted into a "thenable" object, so we need return the now-thenable object's "then" property
      // Useful links:
      // - Official docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description
      // - Issue on SO: https://stackoverflow.com/questions/48318843/why-does-await-trigger-then-on-a-proxy-returned-by-an-async-function?rq=3
      if (contractKey === "then") {
        return Reflect.get(target, prop, receiver);
      }

      if (hasKey(target, contractKey)) {
        return target[contractKey];
      }

      throw new Error(
        `Contract '${contractKey}' not deployed on network '${key}'`,
      );
    },
  });
}

export function readAllAddresses(
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH,
): Record<string, AddressObj> {
  checkExistence(filePath);

  const jsonData = fs.readFileSync(filePath, "utf-8");

  const data: Record<string, AddressObj> = JSON.parse(jsonData);

  return data;
}

export function saveFrontendFiles(
  addresses: Record<string, AddressObj>,
  filePath = DEFAULT_CONTRACT_ADDRESS_FILE_PATH,
) {
  checkExistence(filePath);

  const data = readAllAddresses(filePath);

  Object.assign(data, addresses);

  fs.writeFileSync(filePath, `${JSON.stringify(data, undefined, 2)}\n`);
}

function checkExistence(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`No such file, path: '${filePath}'.`);
  }
}

function hasKey<T extends object>(obj: T, k: keyof any): k is keyof T {
  return k in obj;
}

export function createEmptyAddressObj(): AddressObj {
  return {
    LegitExchange: {
      implementation: "",
      proxy: "",
    },
    uniswap: "",
    tokens: {
      usdc: "",
      weth: "",
    },
  };
}
