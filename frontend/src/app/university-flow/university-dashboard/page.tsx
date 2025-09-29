'use client';

import React, { useState } from 'react';
import { ethers } from "ethers";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { Anton } from 'next/font/google';

// --- SETUP ---

const anton = Anton({
    variable: "--font-anton",
    subsets: ["latin"],
    weight: ['400']
});

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

async function generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    return [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// --- COMPONENT ---

const CreateCertificatePage = () => {
    const [studentName, setStudentName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [universityName, setUniversityName] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [score, setScore] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const generatePdf = (hash: string) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Certificate of Completion", 105, 30, { align: 'center' });

        doc.setFontSize(14);
        doc.text("This is to certify that", 105, 50, { align: 'center' });

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(studentName, 105, 70, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text("has successfully completed the course", 105, 90, { align: 'center' });

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(courseName, 105, 110, { align: 'center' });

        doc.setFontSize(14);
        doc.text(`With a score of: ${score}`, 105, 125, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Issued by: ${universityName}`, 105, 145, { align: 'center' });
        doc.text(`During the period: ${timePeriod}`, 105, 155, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Blockchain Verification Hash:", 10, 280);
        doc.text(hash, 10, 285, { maxWidth: 190 });

        doc.save(`${studentName}_${courseName}_certificate.pdf`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentName || !courseName || !universityName || !timePeriod || !score) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!window.ethereum) {
            toast.error("MetaMask is not installed. Please install MetaMask and try again.");
            return;
        }

        setIsLoading(true);

        try {
            const dataToHash = studentName + courseName + universityName + timePeriod + score;
            const generatedHash = await generateHash(dataToHash);

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.createCertificates(studentName, courseName, generatedHash);

            toast.promise(tx.wait(), {
                loading: "Submitting certificate to the blockchain...",
                success: (receipt: any) => {
                    generatePdf(generatedHash);
                    return `Certificate created successfully! Tx: ${receipt.hash.slice(0, 10)}...`;
                },
                error: (err: any) => `Failed to create certificate: ${err.message}`
            });
        } catch (error: any) {
            toast.error("Operation failed", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // This is the line that was changed
        <div className="min-h-screen bg-black text-sky-500 flex flex-col items-center pt-36 p-4 sm:p-10">
            <h1 className={`${anton.variable} font-sans italic mt-12  font-extrabold text-5xl md:text-7xl mb-10 tracking-widest text-center`}>
                CREATE CERTIFICATE
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-900/50 p-6 sm:p-8 rounded-2xl border-2 border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">Student Name</label>
                        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">Course Name</label>
                        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-mono">University Name</label>
                        <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block mb-2 font-mono">Time Period (e.g., 2021-2025)</label>
                        <input type="text" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">Score / Grade</label>
                        <input type="text" value={score} onChange={(e) => setScore(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full mt-8 bg-fuchsia-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-fuchsia-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Processing...' : 'Create & Download PDF'}
                </button>
            </form>
        </div>
    );
}

export default CreateCertificatePage;