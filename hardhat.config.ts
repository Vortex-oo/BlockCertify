import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers/types";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    // This network is now the default automatically because it's named "hardhat"
    hardhat: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      type: "http",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      type: "http",
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      type: "http",
    },
  },
};

export default config;
