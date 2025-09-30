"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { toast } from "sonner";
import { blockCertifyAbi } from "@/lib/abi";

declare global {
    interface Window {
        ethereum?: ethers.Eip1193Provider;
    }
}

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
            const contract = new ethers.Contract(contractAddress, blockCertifyAbi, signer);
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
