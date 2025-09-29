"use client";

import Link from "next/link";
import { Anton } from "next/font/google";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <div className={`${anton.variable} min-h-screen bg-black text-sky-500 flex flex-col justify-between relative`}>
      
      {/* Title + Summary */}
      <div className="px-6 sm:px-12 mt-24 sm:mt-44 md:pr-[40%]">
        <h1 className="font-sans italic font-extrabold text-4xl sm:text-6xl md:text-8xl tracking-widest text-center md:text-left">
          BLOCK-
          <br className="hidden md:block" /> CERTIFY
        </h1>

        <p className="mt-4 sm:mt-6 font-mono text-white text-base sm:text-lg leading-relaxed text-center md:text-left md:w-2/3">
          BlockCertify is a blockchain-based platform for secure certificate
          generation and verification. Universities and institutions can issue
          certificates that are stored on the Ethereum blockchain, making them
          tamper-proof, transparent, and easily verifiable anywhere in the
          world.
        </p>

        {/* Buttons for mobile (inline below summary) */}
        <div className="mt-8 flex flex-col items-center gap-6 md:hidden">
          <Link
            href="/university-flow"
            className="font-mono text-lg sm:text-xl border-2 border-orange-500 text-orange-500 px-6 py-4 rounded-2xl text-center font-bold hover:bg-orange-500 hover:text-black transition w-full max-w-xs"
          >
            Add Your University
          </Link>

          <Link
            href="/verify-cert"
            className="font-mono text-lg sm:text-xl border-2 border-fuchsia-500 text-fuchsia-500 px-6 py-4 rounded-2xl text-center font-bold hover:bg-fuchsia-500 hover:text-black transition w-full max-w-xs"
          >
            Verify Your Certificate
          </Link>
        </div>
      </div>

      {/* Buttons for desktop (absolute on right) */}
      <div className="hidden md:flex flex-col items-end gap-10 absolute right-12 top-60">
        <Link
          href="/university-flow"
          className="font-mono text-2xl md:text-4xl border-2 border-orange-500 text-orange-500 px-20 md:px-24 py-6 rounded-2xl text-center font-bold hover:bg-orange-500 hover:text-black transition"
        >
          Add Your University
        </Link>

        <Link
          href="/verify-cert"
          className="font-mono text-2xl md:text-4xl border-2 border-fuchsia-500 text-fuchsia-500 px-10 md:px-16 py-6 rounded-2xl text-center font-bold hover:bg-fuchsia-500 hover:text-black transition"
        >
          Verify Your Certificate
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-700 bg-black/30 mt-16 py-6 px-4 sm:px-8 text-gray-400 relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs sm:text-sm">
            Created By DEBJIT SEN |{" "}
            <a
              href="https://vortex-protfolio.vercel.app/"
              target="_blank"
              className="font-semibold text-white hover:underline transition"
            >
              Hire Me
            </a>
          </p>
          <p className="text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} BlockCertify. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm">
            <a
              href="https://github.com/debjitsen/BlockCertify"
              className="hover:text-white hover:underline transition"
              target="_blank"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
