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
    <div className="min-h-screen bg-black text-sky-500 flex flex-col justify-between p-10">
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side (Title and Text) */}
          <div className="flex flex-col gap-8">
            <h1 className="font-sans italic font-extrabold text-9xl tracking-widest text-white">
              BLOCK- <br /> CERTIFY
            </h1>
            <div className="font-mono text-white max-w-2xl">
              <p className="text-lg">
                BlockCertify is a blockchain-based platform for secure certificate generation and verification. Universities and institutions can issue certificates that are stored on the Ethereum blockchain, making them tamper-proof, transparent, and easily verifiable anywhere in the world.
              </p>
            </div>
          </div>

          {/* Right Side (Buttons) */}
          <div className="flex justify-center md:justify-end">
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/university-flow"
                className="font-mono text-5xl border-2 border-orange-500 text-orange-500 px-16 py-6 rounded-2xl text-center font-bold hover:bg-orange-500 hover:text-black transition w-full"
              >
                Add Your University
              </Link>

              <Link
                href="/verify"
                className="font-mono text-5xl border-2 border-fuchsia-500 text-fuchsia-500 px-10 py-6 rounded-2xl text-center font-bold hover:bg-fuchsia-500 hover:text-black transition w-full"
              >
                Verify Your Certificate
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-gray-700 bg-black/30">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-8 text-gray-400">

          {/* Left Side */}
          <p className="text-sm">
            Created By DEBJIT SEN | <a href="https://vortex-protfolio.vercel.app/" target="_blank" className="font-semibold text-white hover:underline transition">Hire Me</a>
          </p>

          {/* Center */}
          <p className="text-sm">
            &copy; {new Date().getFullYear()} BlockCertify. All rights reserved.
          </p>

          {/* Right Side */}
          <p className="text-sm">
            <a href="https://github.com/debjitsen/BlockCertify" className="hover:text-white hover:underline transition"
            target="_blank">
              GitHub Repository
            </a>
          </p>

        </div>
      </footer>
    </div>
  );
}
