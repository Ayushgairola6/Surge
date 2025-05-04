'use client'

import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from '@/store/AuthSlice';
import Link from "next/link";
import { useRef, useEffect } from 'react';
import CicularLoader from "../components/CircularLoader";
import { useRouter } from 'next/navigation';
import Toast from "../components/Toast";
import Image from 'next/image'
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
        <div className="min-h-screen w-full flex flex-col sm:flex-row items-center justify-center  text-white  bg-black font-mono relative px-4">
            {/* Toast Notification */}
            {status === "failed" && <Toast className="absolute top-4 left-4" />}

            {/* Login Form */}
            <form
                onSubmit={(e) => handle_Login(e)}
                className="w-full sm:w-1/2 max-w-md flex flex-col justify-center gap-5 p-6 bg-gradient-to-br from-white/15 to-white/5 rounded-xl "
            >
                <h1 className="text-xl sm:text-2xl font-bold text-center
                 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                    Welcome back! Ready spill that secret?
                </h1>
                <p className="text-sm text-center text-gray-300">
                    Enter your email below to login to your account
                </p>

                {/* Email Input */}
                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 ">Email</label>
                    <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        required
                        className="w-full border border-gray-400 focus:border-sky-300 rounded-xl px-3 py-2 text-lg font-medium text-black"
                    />
                </div>

                {/* Password Input */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password">Password</label>
                        <Link href="/ForgotPassword" className="text-sm text-blue-600 hover:underline">Forgot your password?</Link>
                    </div>
                    <input
                        ref={passwordRef}
                        id="password"
                        type="password"
                        required
                        className="w-full border border-gray-400 focus:border-sky-300 rounded-xl px-3 py-2 text-lg font-medium text-black"
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
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-black py-2 px-4 rounded-xl font-bold shadow-md border border-black shadow-black hover:scale-95 transition-all"
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
                <div className="hidden sm:flex items-center justify-center  w-[30rem] p-6">

                    <div
                        className="relative bg-gradient-to-r from-white/5 to-black rounded-xl 
              shadow-lg overflow-hidden transition-transform
               duration-300 "
                    >
                        {/* Post Image */}
                        {/*<div className="h-48 w-full relative">
                <img
                  src={ "/NoImage.jpg"}
                  alt="/"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black opacity-20"></div>
              </div>*/}
                        {/* Post Content */}
                        <div className="p-4">
                            <div className="flex items-center justify-start gap-2 px-4 w-full">
                                <Image src="/female.jpg" alt="" height={25} width={25} className="rounded-full" />
                                <span className="font-serif text-md text-transparent 
                  bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700
                  ">Bonita_bitch</span>
                            </div>
                            <h3 className="text-lg font-mono uppercase font-bold text-gray-300 mb-2">
                                He is the one
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-3">
                                We met on Tinder. From the moment I saw him—tall, effortless charm, that confident smirk—I just knew. Not in the cliché way, but in the kind of way that makes your pulse race like you’re stepping into something dangerous and delicious.
                                The way he greets people, the way he makes everyone feel seen, the way he carries himself like the world was made to watch him move... He is the one.
                                No opinion, no warning, no red flag in the future could ever shake that certainty in me because—
                                ...well, you’ll understand soon enough
                            </p>
                        </div>


                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;
