"use client";

import Link from "next/link";
import { Anton } from 'next/font/google'


const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ['400']
})


export default function Home() {
  return (
    <div className="min-h-screen bg-black text-sky-500 flex flex-col items-center justify-center p-10">

      {/* Title */}
      <h1 className="font-sans italic font-extrabold text-9xl mb-16 tracking-widest absolute left-14 top-32">
        BLOCK- <br /> CERTIFY
      </h1>

      <div className="flex flex-col md:flex-row gap-12 items-center">

        {/* Left Side (Card Text) */}
        <div className="font-mono w-2xl absolute left-16 top-96 text-white">
          <p className="text-lg">
            BlockCertify is a blockchain-based platform for secure certificate generation and verification. Universities and institutions can issue certificates that are stored on the Ethereum blockchain, making them tamper-proof, transparent, and easily verifiable anywhere in the world.
          </p>
        </div>

        {/* Right Side (Buttons) */}
        <div className="absolute right-16 top-48">
          <div className="flex flex-col items-center gap-10 ">
            <Link
              href="/create"
              className=" font-mono text-5xl border-2 border-orange-500 text-orange-500 px-16 py-6 rounded-2xl text-center  font-bold hover:bg-orange-500 hover:text-black transition"
            >
              Get Your Uni Verified
            </Link>

            <Link
              href="/verify"
              className=" font-mono text-5xl border-2 border-fuchsia-500 text-fuchsia-500 px-10 py-6 rounded-2xl text-center  font-bold hover:bg-fuchsia-500 hover:text-black transition"
            >
              Verify Your Certificate
            </Link>
          </div>
        </div>

      </div>

      <footer className="w-full h-20 flex items-center justify-center mt-20 absolute bottom-0">
        <p className="text-white text-center">
          &copy; 2025 BlockCertify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
