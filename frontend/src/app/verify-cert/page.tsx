'use client';
import React, { useState } from 'react';
import { ethers } from "ethers";
import { toast } from "sonner";
import { blockCertifyAbi } from '@/lib/abi';

// Add type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: ethers.Eip1193Provider;
    }
}

// A type for the certificate structure
type Certificate = {
    studentName: string;
    courseName: string;
    certHash: string;
    issueDate: bigint;
    university: string;
    isValid: boolean;
};

// Helper function to convert an ArrayBuffer to a hex string
function bufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

const VerifyPdfPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [certificateInfo, setCertificateInfo] = useState<Certificate | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            toast.error("Please select a valid PDF file.");
            setSelectedFile(null);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select a certificate PDF to verify.");
            return;
        }

        setIsLoading(true);
        setSearched(false);
        setCertificateInfo(null);
        setIsValid(null);

        if (!window.ethereum) {
            toast.error("MetaMask not detected. Please install it to continue.");
            setIsLoading(false);
            return;
        }

        try {
            // Step 1: Hash the PDF file in the browser
            toast.info("Generating hash from PDF...");
            const arrayBuffer = await selectedFile.arrayBuffer();
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
            const generatedHash = bufferToHex(hashBuffer);

            toast.success("Hash generated successfully!");

            // Step 2: Use the hash to call the smart contract
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

            if (!contractAddress) {
                throw new Error("Contract address is not configured.");
            }

            const contract = new ethers.Contract(contractAddress, blockCertifyAbi, provider);

            const [isCertValid, certDetails] = await contract.verifyCertificate(generatedHash);

            setIsValid(isCertValid);
            if (isCertValid) {
                setCertificateInfo(certDetails);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Could not connect to the contract.";
            toast.error("Verification Failed", { description: errorMessage });
        } finally {
            setIsLoading(false);
            setSearched(true);
        }
    };

    return (
        <div className='min-h-screen bg-black text-sky-500 flex flex-col items-center pt-24 px-4 sm:px-6 md:px-8'>
            {/* Heading */}
            <h1 className='font-sans italic font-extrabold text-3xl sm:text-4xl md:text-6xl mb-10 tracking-widest text-center'>
                Verify Certificate
            </h1>

            {/* Upload Form */}
            <div className="w-full max-w-xl bg-gray-900/50 border border-sky-900 rounded-lg p-6 sm:p-8 shadow-2xl shadow-sky-900/20">
                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                    <label htmlFor="pdf-upload" className="font-bold text-base sm:text-lg mb-1">Upload Certificate PDF</label>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-900 file:text-sky-300 hover:file:bg-sky-800 text-gray-400 w-full"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-sky-500 text-black font-bold px-6 sm:px-8 py-3 rounded-md hover:bg-sky-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4 cursor-pointer text-sm sm:text-base"
                        disabled={isLoading || !selectedFile}
                    >
                        {isLoading ? 'Verifying...' : 'Verify PDF'}
                    </button>
                </form>
            </div>

            {/* Results Section */}
            <div className="w-full max-w-xl mt-8 px-2">
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                )}

                {searched && !isLoading && (
                    isValid && certificateInfo ? (
                        <div className="bg-green-900/50 border border-green-500 text-white rounded-lg p-5 sm:p-6 animate-fade-in">
                            <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-3 sm:mb-4 text-center sm:text-left">Certificate is Valid ✅</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-sm sm:text-base">
                                <p><strong>Student:</strong> {certificateInfo.studentName}</p>
                                <p><strong>Course:</strong> {certificateInfo.courseName}</p>
                                <p><strong>University:</strong> {certificateInfo.university}</p>
                                <p><strong>Issued On:</strong> {new Date(Number(certificateInfo.issueDate) * 1000).toLocaleDateString()}</p>
                                <p className="sm:col-span-2"><strong>Hash:</strong> <span className="break-all text-xs">{certificateInfo.certHash}</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-900/50 border border-red-500 text-white rounded-lg p-5 sm:p-6 text-center animate-fade-in">
                            <h3 className="text-xl sm:text-2xl font-bold text-red-400">Certificate Not Found or Invalid ❌</h3>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default VerifyPdfPage;
