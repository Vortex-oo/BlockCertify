'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { toast } from "sonner";


declare global {
    interface Window {
        ethereum?: any;
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


const VerificationPage = () => {
    const router = useRouter();

    useEffect(() => {
        const UniversityVerificationFlow = async () => {
            if (!window.ethereum) {
                toast.error("MetaMask not detected", {
                    description: "Please install MetaMask to continue.",
                });
                // Redirect to home if no wallet
                setTimeout(() => router.push('/'), 3000);
                return;
            }

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []); // Prompt user to connect
                const signer = await provider.getSigner();
                const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

                if (!contractAddress) {
                    toast.error("Configuration Error", { description: "Contract address not set." });
                    return;
                }

                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                const signerAddress = await signer.getAddress();
                const isUni = await contract.isUniversity(signerAddress);

                if (isUni) {
                    toast.success("University Verified!", {
                        description: "Redirecting to your dashboard...",
                    });
                    setTimeout(() => {
                        router.push('/university-flow/university-dashboard');
                    }, 2000);
                } else {
                    toast.error("Verification Failed", {
                        description: "The connected wallet is not registered as a university.",
                    });
                    setTimeout(() => router.push('/university-flow/verify-university'), 2000); // Redirect non-unis back home
                }
            } catch (error) {
                console.error("Error verifying university:", error);
                toast.error("Error verifying university. Please try again.");
                setTimeout(() => router.push('/'), 10000);
            }
        };

        UniversityVerificationFlow();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="flex flex-col items-center text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
                <h2 className="text-2xl font-bold mb-2">Verifying University Status...</h2>
                <p className="text-gray-400">
                    Please check your wallet for any prompts.
                </p>
            </div>
        </div>
    );
}

export default VerificationPage;