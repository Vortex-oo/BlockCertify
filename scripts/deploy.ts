import { ethers } from "hardhat";

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("------------------------------------------");
    console.log("Deploying contracts with the account:", deployer.address);
    // Get the current balance of the deployer
    console.log(
        "Account balance:",
        (await ethers.provider.getBalance(deployer.address)).toString(),
        "wei"
    );
    console.log("------------------------------------------");

    const BlockCertify = await ethers.getContractFactory("BlockCertify");

    // Deploy the contract
    console.log("Deploying BlockCertify contract...");
    const blockCertify = await BlockCertify.deploy();

    await blockCertify.waitForDeployment();
    console.log("Deployment transaction confirmed!");

    // Get the deployed contract address
    const deployedAddress = await blockCertify.getAddress();
    console.log("BlockCertify deployed to:", deployedAddress);
    console.log("------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });