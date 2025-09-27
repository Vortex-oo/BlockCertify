import dotenv from "dotenv";
dotenv.config();
import { NextResponse } from "next/server";
import { ethers } from "ethers";

// Provider
const provider = new ethers.JsonRpcProvider(process.env.INFURA_SEPOLIA_URL);

// Contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
    "function verifyCertificate(string _certHash) public view returns (bool, (string studentName, string courseName, string certHash, uint256 issueDate, string university, bool isValid))",
];

const contractInteraction = async (certId) => {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const [isValid, cert] = await contract.verifyCertificate(certId);

    return {
        isValid,
        studentName: cert.studentName,
        courseName: cert.courseName,
        certHash: cert.certHash,
        issueDate: cert.issueDate.toString(),
        university: cert.university,
    };
};

export async function POST(request) {
    try {
        const { certificateId } = await request.json();
        const certificate = await contractInteraction(certificateId);
        return NextResponse.json(certificate);
    } catch (error) {
        console.error(error,"error in verify certificate api");
        return NextResponse.json({ error: "Failed to verify certificate" }, { status: 500 });
    }
}
