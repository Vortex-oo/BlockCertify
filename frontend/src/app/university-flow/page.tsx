'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { toast } from "sonner";
import { blockCertifyAbi } from '@/lib/abi';


declare global {
    interface Window {
        ethereum?: ethers.Eip1193Provider;
    }
}

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
                // console.log("Contract Address from ENV:", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

                if (!contractAddress) {
                    toast.error("Configuration Error", { description: "Contract address not set." });
                    return;
                }

                const contract = new ethers.Contract(contractAddress, blockCertifyAbi, signer);
                const signerAddress = await signer.getAddress();
                // console.log("Signer Address:", signerAddress);



                // -------------------------------------------
                // log for error checking

                // console.log("Contract Address:", contractAddress);
                // const code = await provider.getCode(contractAddress);
                // console.log("Deployed Code:", code);

                // const network = await provider.getNetwork();
                // console.log("Connected Network:", network);

                // -------------------------------------------

                const isUni = await contract.isUniversity(signerAddress);
                // console.log("isUniversity result:", isUni);

                if (isUni) {
                    toast.success("University Verified!", {
                        description: "Redirecting to your dashboard...",
                    });
                    setTimeout(() => {
                        router.push('/university-flow/university-dashboard');
                    }, 1000);
                } else {
                    toast.error("Verification Failed", {
                        description: "The connected wallet is not registered as a university.",
                    });
                    setTimeout(() => router.push('/university-flow/verify-university'), 1000); // Redirect non-unis back home
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
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