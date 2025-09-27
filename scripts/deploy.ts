
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const BlockCertify = await ethers.getContractFactory("BlockCertify");
    const blockCertify = await BlockCertify.deploy();

    console.log("BlockCertify deployed to:", await blockCertify.getAddress());

}
main().
    then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


//Deploying contracts with the account: 0x9eDa49590C5e99be8236984D2B6C7390D1dad312
//BlockCertify deployed to: 0xF054B3Ff4C3200a440085a0dFf3A32C738F6e191