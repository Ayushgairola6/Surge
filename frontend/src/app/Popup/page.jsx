'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
const Popup = () => {
    const router = useRouter();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn === true) {
            router.push("/")
        }
    }, [isLoggedIn])

    return (


        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <div className="flex flex-col items-center justify-center w-full max-w-md p-10 bg-gradient-to-r from-white/15 to-black/90  bg-opacity-70 rounded-2xl shadow-2xl border border-gray-300 space-y-8">
                <h1 className="text-3xl font-extrabold text-white text-center leading-tight">
                    Hold up! 🔥
                </h1>
                <p className="text-center text-gray-400 text-md">
                    You need to log in or sign up to spill the hottest secrets.
                </p>

                <div className="flex flex-col w-full gap-4 mt-4">
                    <Link href="/Login">
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg">
                            Login
                        </button>
                    </Link>
                    <Link href="/SignupPage">
                        <button className="w-full px-6 py-3 bg-transparent border-2 border-purple-600 text-purple-400 rounded-xl hover:bg-purple-700 hover:text-white transition-all duration-300 font-semibold text-lg">
                            Sign Up
                        </button>
                    </Link>
                </div>

                <div className="text-center mt-4">
                    <Link href="/">
                        <span className="text-sm text-gray-400 hover:text-gray-200 underline">
                            Go back to homepage
                        </span>
                    </Link>
                </div>
            </div>
        </div>


    );
}

export default Popup;