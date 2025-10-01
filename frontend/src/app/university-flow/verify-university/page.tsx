'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { useRouter } from 'next/navigation';
import { Anton } from 'next/font/google';

const anton = Anton({
    variable: "--font-anton",
    subsets: ["latin"],
    weight: ['400']
});

const UniversityDetailsPage = () => {
    const router = useRouter();

    const [uniName, setUniName] = useState<string>("");
    const [uniWalletAddress, setUniWalletAddress] = useState<string>("");
    const [uniRegNumber, setUniRegNumber] = useState<string>("");
    const [universityContactEmail, setUniversityContactEmail] = useState<string>("");
    const [uniPhysicalAddress, setUniPhysicalAddress] = useState<string>("");


    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uniName || !uniWalletAddress || !uniRegNumber || !universityContactEmail || !uniPhysicalAddress) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(universityContactEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        // This object's keys MUST exactly match the variables in your EmailJS template
        const templateParams = {
            uni_name: uniName,
            uni_wallet_address: uniWalletAddress,
            uni_reg_number: uniRegNumber,
            uni_contact_email: universityContactEmail,
            uni_physical_address: uniPhysicalAddress,
        };

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
                templateParams,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
            );

            toast.success("Application submitted successfully!", {
                description: "Kindly wait for approval. Redirecting to homepage...",
            });

            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (error) {
            console.error('Failed to send email.', error);
            toast.error("Failed to submit application.", {
                description: "Please try again later."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-sky-500 flex flex-col items-center pt-24 sm:pt-36 p-4 sm:p-10">
            <h1 className={`${anton.variable} font-sans italic mt-12 font-extrabold text-4xl md:text-6xl mb-10 tracking-widest text-center uppercase`}>
                University Registration
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-900/50 p-6 sm:p-8 rounded-2xl border-2 border-fuchsia-500/50 shadow-2xl shadow-fuchsia-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">University Name</label>
                        <input type="text" value={uniName} onChange={(e) => setUniName(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">Official Wallet Address</label>
                        <input type="text" value={uniWalletAddress} onChange={(e) => setUniWalletAddress(e.target.value)} placeholder="0x..." className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>

                    <div>
                        <label className="block mb-2 font-mono">Registration Number</label>
                        <input type="text" value={uniRegNumber} onChange={(e) => setUniRegNumber(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>

                    <div>
                        <label className="block mb-2 font-mono">Contact Email</label>
                        <input type="email" value={universityContactEmail} onChange={(e) => setUniversityContactEmail(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 font-mono">University Physical Address</label>
                        <input type="text" value={uniPhysicalAddress} onChange={(e) => setUniPhysicalAddress(e.target.value)} className="w-full p-3 bg-gray-800 rounded-lg border border-sky-700 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none" />
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full mt-8 bg-fuchsia-500 text-black font-bold text-lg py-4 rounded-xl hover:bg-fuchsia-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default UniversityDetailsPage;
