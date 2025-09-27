import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("BlockCertify", function () {
    let BlockCertify: any, blockCertify: any, owner: any, university: any, otherUniversity: any, student: any;

    beforeEach(async function () {
        [owner, university, otherUniversity, student] = await ethers.getSigners();

        // Deploy contract
        BlockCertify = await ethers.getContractFactory("BlockCertify");
        blockCertify = await BlockCertify.deploy();
        await blockCertify.waitForDeployment();
    });

    // ---- Deployment ----
    it("Should set the right owner", async function () {
        expect(await blockCertify.owner()).to.equal(owner.address);
    });

    // ---- University Management ----
    it("Owner should add a university", async function () {
        await blockCertify.addUniversity(university.address, "Harvard");
        const isUni = await blockCertify.isUniversity(university.address);
        expect(isUni).to.equal(true);
    });

    it("Non-owner should NOT add a university", async function () {
        await expect(
            blockCertify.connect(university).addUniversity(university.address, "FakeUni")
        ).to.be.revertedWithCustomError(blockCertify, "OwnableUnauthorizedAccount")
            .withArgs(university.address);

    });

    it("Owner should remove a university", async function () {
        await blockCertify.addUniversity(university.address, "Harvard");
        await blockCertify.removeUniversity(university.address);
        const isUni = await blockCertify.isUniversity(university.address);
        expect(isUni).to.equal(false);
    });

    // ---- Certificate Management ----
    it("Registered university should issue certificate", async function () {
        await blockCertify.addUniversity(university.address, "Harvard");

        await blockCertify
            .connect(university)
            .createCertificates("Alice", "Blockchain", "hash123");

        const [isValid, cert] = await blockCertify.verifyCertificate("hash123");
        expect(isValid).to.equal(true);
        expect(cert.studentName).to.equal("Alice");
        expect(cert.courseName).to.equal("Blockchain");
        expect(cert.university).to.equal("Harvard");
    });

    it("Unregistered university should NOT issue certificate", async function () {
        await expect(
            blockCertify
                .connect(otherUniversity)
                .createCertificates("Bob", "AI", "hash456")
        ).to.be.revertedWith("Not a registered university");
    });

    it("Should not allow duplicate certificate hash", async function () {
        await blockCertify.addUniversity(university.address, "Harvard");

        await blockCertify
            .connect(university)
            .createCertificates("Alice", "Blockchain", "hash123");

        await expect(
            blockCertify
                .connect(university)
                .createCertificates("Alice", "Blockchain", "hash123")
        ).to.be.revertedWith("Certificate already exists");
    });
});
