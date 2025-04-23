'use client'

import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from '@/store/AuthSlice';
import Link from "next/link";
import { useRef, useEffect } from 'react';
import CicularLoader from "../components/CircularLoader";
import { useRouter } from 'next/navigation';
import Toast from "../components/Toast";

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const status = useSelector(state => state.auth.loginstatus);
    const emailRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn]);

    function handle_Login(e) {
        e.preventDefault();
        const form = new FormData();
        form.append("email", emailRef.current.value);
        form.append("password", passwordRef.current.value);
        dispatch(LoginUser(form));
    }

    return (
        <div className="min-h-screen w-full flex flex-col sm:flex-row items-center justify-center bg-white font-mono relative px-4">
            {/* Toast Notification */}
            {status === "failed" && <Toast className="absolute top-4 left-4" />}

            {/* Login Form */}
            <form
                onSubmit={(e)=>handle_Login(e)}
                className="w-full sm:w-1/2 max-w-md flex flex-col justify-center gap-5 p-6 bg-white rounded-lg"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center">
                    Welcome back! Ready to share your ideas?
                </h1>
                <p className="text-sm text-center text-gray-600">
                    Enter your email below to login to your account
                </p>

                {/* Email Input */}
                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                    <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        required
                        className="w-full border border-gray-400 focus:border-sky-300 rounded-xl px-3 py-2 text-lg font-medium"
                    />
                </div>

                {/* Password Input */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-1 font-semibold">
                        <label htmlFor="password">Password</label>
                        <Link href="/Signup" className="text-sm text-blue-600 hover:underline">Forgot your password?</Link>
                    </div>
                    <input
                        ref={passwordRef}
                        id="password"
                        type="password"
                        required
                        className="w-full border border-gray-400 focus:border-sky-300 rounded-xl px-3 py-2 text-lg font-medium"
                    />
                </div>

                {/* Login Button or Loader */}
                {status === "loading" ? (
                    <div className="flex items-center justify-center">
                    <CicularLoader />
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-lime-500 to-pink-500 text-black py-2 px-4 rounded-xl font-bold shadow-md border border-black shadow-black hover:scale-95 transition-all"
                    >
                        Login
                    </button>
                )}

                {/* Signup Prompt */}
                <p className="text-center font-bold text-lg">
                    Don't have an account?{" "}
                    <Link href="/SignupPage" className="underline text-blue-600">Sign up</Link>
                </p>
            </form>


            {/* Side Image Section */}
            <div className="hidden sm:flex items-center justify-center w-1/2 p-6">
                <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-xl">
                    <img
                        className="w-full h-full object-cover"
                        src="https://plus.unsplash.com/premium_photo-1668383777295-8343df447607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdvcmtzcGFjZXxlbnwwfHwwfHx8MA%3D%3D"
                        alt="Creative Workspace"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black opacity-25"></div>
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            Your Ideas{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-sky-600">
                                Matter
                            </span>
                        </h1>
                        <p className="mt-2 text-white text-lg">Let's bring them to life</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;
