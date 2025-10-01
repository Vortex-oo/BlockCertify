'use client'
import React, { useState } from 'react'
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='fixed w-full z-50 bg-black text-white font-mono'>
            <div className='flex justify-between items-center px-8 py-4'>

                {/* Logo */}
                <div>
                    <h1 className='text-2xl font-bold tracking-widest'>
                        <Link href="/">BLOCK CERTIFY</Link>
                    </h1>
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center space-x-6'>
                    <Link href='/' className='font-bold border-4 border-teal-900 rounded-2xl cursor-pointer text-white hover:bg-teal-900 hover:text-white py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Home
                    </Link>
                    <Link href='/university-flow/university-dashboard' className='font-bold border-4 border-orange-400 rounded-2xl cursor-pointer text-white hover:bg-orange-400 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Create
                    </Link>
                    <Link href='/verify-cert' className='font-bold border-4 border-green-700 rounded-2xl cursor-pointer text-white hover:bg-green-500 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Verify
                    </Link>
                    <Link href='/admin' className='font-bold border-4 border-amber-300 rounded-2xl cursor-pointer text-white hover:bg-amber-300 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Admin
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <div className='md:hidden flex items-center'>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='flex flex-col items-center space-y-4 bg-black py-4 md:hidden'>
                    <Link href='/' className='font-bold border-4 border-teal-900 rounded-2xl cursor-pointer text-white hover:bg-teal-900 hover:text-white py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Home
                    </Link>
                    <Link href='/university-flow/university-dashboard' className='font-bold border-4 border-orange-400 rounded-2xl cursor-pointer text-white hover:bg-orange-400 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Create
                    </Link>
                    <Link href='/verify-cert' className='font-bold border-4 border-green-700 rounded-2xl cursor-pointer text-white hover:bg-green-500 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300 hover:scale-105 hover:border-white'>
                        Verify
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Navbar;
