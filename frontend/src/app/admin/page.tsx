'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Import the Eip1193Provider type from ethers
import { ethers, Eip1193Provider } from "ethers";
import { toast } from "sonner";
import { blockCertifyAbi } from '@/lib/abi';

// --- TYPE DECLARATION ---
// This teaches TypeScript that window.ethereum can exist and what its type is.
declare global {
    interface Window {
        ethereum?: Eip1193Provider;
    }
}

const AdminPage = () => {
    const router = useRouter();

    // State for UI visibility and loading
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State for form inputs
    const [uniName, setUniName] = useState<string>("");
    const [uniAddress, setUniAddress] = useState<string>("");

    // This effect runs once on component mount to verify the owner
    useEffect(() => {
        const ownerCheck = async () => {
            if (!window.ethereum) {
                toast.error("MetaMask not detected", {
                    description: "Please install MetaMask to continue.",
                });
                setTimeout(() => router.push('/'), 2000);
                return;
            }

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const signerAddress = await signer.getAddress();

                const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS as string;

                if (!ownerAddress) {
                    toast.error("Configuration Error", { description: "Owner address not set." });
                    return;
                }

                if (signerAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
                    toast.error("Access Denied", {
                        description: "You are not the contract owner.",
                    });
                    setTimeout(() => router.push('/'), 2000);
                    return;
                }

                // If checks pass, show the admin panel
                setIsVisible(true);
                toast.success("Welcome, Owner!", {
                    description: "Admin panel is now accessible.",
                });
            } catch (error) {
                console.error("Error during owner check:", error);
                toast.error("An error occurred. Please reconnect your wallet and try again.");
                router.push('/');
            }
        }

        ownerCheck();
    }, [router]);

    // --- SUBMISSION HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uniName || !uniAddress) {
            toast.error("Missing Information", { description: "Please fill in both fields." });
            return;
        }

        if (!ethers.isAddress(uniAddress)) {
            toast.error("Invalid Address", { description: "The provided university address is not a valid Ethereum address." });
            return;
        }
        
        // Add a check for window.ethereum here as well for safety
        if (!window.ethereum) {
            toast.error("MetaMask not detected. Please connect your wallet.");
            return;
        }

        setIsLoading(true);
        toast.info("Submitting transaction...", { description: "Please confirm in your wallet." });

        try {
            // --- FIXED LINE ---
            // No more 'as any' is needed because we defined the type above.
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

            if (!contractAddress) {
                toast.error("Configuration Error", { description: "Contract address not set." });
                setIsLoading(false);
                return;
            }

            const contract = new ethers.Contract(contractAddress, blockCertifyAbi, signer);

            const tx = await contract.addUniversity(uniAddress, uniName);

            toast.info("Processing transaction...", { description: "Waiting for blockchain confirmation." });
            
            await tx.wait();

            toast.success("University Added Successfully!", {
                description: `${uniName} has been registered on the contract.`,
            });
            
            setUniName("");
            setUniAddress("");

        } catch (error) {
            console.error("Transaction failed:", error);
            let errorMessage = "An unexpected error occurred.";

            if (error && typeof error === 'object') {
                if ('reason' in error && typeof error.reason === 'string') {
                    errorMessage = error.reason;
                } else if ('message' in error && typeof error.message === 'string') {
                    errorMessage = error.message;
                }
            }

            toast.error("Transaction Failed", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24 font-mono">
            <h1 className="text-5xl font-bold mb-8">Admin Panel</h1>

            {isVisible ? (
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl mb-6">Add New University</h2>

                    <div className="mb-4">
                        <label htmlFor="uniName" className="block mb-2 text-sm font-medium text-gray-300">University Name</label>
                        <input
                            type="text"
                            id="uniName"
                            value={uniName}
                            onChange={(e) => setUniName(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g., Stanford University"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="uniAddress" className="block mb-2 text-sm font-medium text-gray-300">University Wallet Address</label>
                        <input
                            type="text"
                            id="uniAddress"
                            value={uniAddress}
                            onChange={(e) => setUniAddress(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="0x..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Submitting...' : 'Add University'}
                    </button>
                </form>
            ) : (
                <p>Verifying owner access...</p>
            )}
        </div>
    );
};

export default AdminPage;