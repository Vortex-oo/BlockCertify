"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { toast } from "sonner";

declare global {
    interface Window {
        ethereum?: ethers.Eip1193Provider;
    }
}

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "certHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "uniAddress",
                "type": "address"
            }
        ],
        "name": "addCertificate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "uni",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uniName",
                "type": "string"
            }
        ],
        "name": "universityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "uni",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uniName",
                "type": "string"
            }
        ],
        "name": "universityRemoved",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_uni",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_uniName",
                "type": "string"
            }
        ],
        "name": "addUniversity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_stdName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_courseName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_certHash",
                "type": "string"
            }
        ],
        "name": "createCertificates",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_uni",
                "type": "address"
            }
        ],
        "name": "isUniversity",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_uni",
                "type": "address"
            }
        ],
        "name": "removeUniversity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certHash",
                "type": "string"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "courseName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "certHash",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "issueDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "university",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "isValid",
                        "type": "bool"
                    }
                ],
                "internalType": "struct BlockCertify.Certificate",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

const AddUniversityPage = () => {
    const router = useRouter();
    const [uniName, setUniName] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const addUniversity = async () => {
        if (!window.ethereum) {
            toast.error("MetaMask not detected", {
                description: "Please install MetaMask to continue.",
            });
            setTimeout(() => router.push("/"), 3000);
            return;
        }

        if (uniName.trim() === "") {
            toast.error("University name cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // request wallet connection
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const userAddress = await signer.getAddress();

            const tx = await contract.addUniversity(userAddress, uniName);
            await tx.wait();

            toast.success("University added successfully!", {
                description: "Redirecting to your dashboard...",
            });

            setTimeout(() => {
                router.push("/university-flow/university-dashboard");
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the university.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-mono">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6">Register Your University</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addUniversity();
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        value={uniName}
                        onChange={(e) => setUniName(e.target.value)}
                        placeholder="Enter University Name"
                        className="border border-gray-700 bg-black px-4 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                Adding...
                            </div>
                        ) : (
                            "Add University"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUniversityPage;
