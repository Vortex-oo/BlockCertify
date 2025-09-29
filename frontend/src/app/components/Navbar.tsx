'use client'
import React from 'react'
import Link from "next/link";

const Navbar = () => {
    return (
        <div className='flex justify-between items-center px-8 py-4 fixed w-full text-white z-50 font-mono'>

            <div>
                <h1 className='text-2xl font-bold tracking-widest'>
                    <Link href="/">BLOCK CERTIFY</Link>
                </h1>
            </div>

            <div className='flex items-center space-x-6'>
                <Link href='/' className='font-bold border-4 border-teal-900 rounded-2xl cursor-pointer text-white  hover:bg-teal-900 hover:text-white py-2 px-6 hover:rounded-full transition-all duration-300  hover:scale-105 hover:border-white'>
                    Home
                </Link>
                <Link href='/university-flow/university-dashboard' className='font-bold border-4 border-orange-400 rounded-2xl cursor-pointer text-white  hover:bg-orange-400 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300  hover:scale-105 hover:border-white'>
                    Create
                </Link>
                <Link href='/verify-cert' className='font-bold border-4 border-green-700 rounded-2xl cursor-pointer text-white  hover:bg-green-500 hover:text-black py-2 px-6 hover:rounded-full transition-all duration-300  hover:scale-105 hover:border-white'>
                    Verify
                </Link>
            </div>
        </div>
    )
}

export default Navbar;