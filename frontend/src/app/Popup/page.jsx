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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="flex flex-col items-center justify-center w-11/12 max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 shadow-black">
                <h1 className="text-3xl font-extrabold text-gray-900 text-center leading-tight">
                    Welcome Back! 
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Please log in or sign up to access this feature.
                </p>
                <div className="flex items-center justify-center gap-4 mt-8 w-full">
                    <Link href="/Login">
                        <button className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-700 transition-all duration-300">
                            Login
                        </button>
                    </Link>
                    <Link href="/SignupPage">
                        <button className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 rounded-xl">
                            Signup
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Popup;