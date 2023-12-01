import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "./tasks";
declare const config: HardhatUserConfig;
export default config;
