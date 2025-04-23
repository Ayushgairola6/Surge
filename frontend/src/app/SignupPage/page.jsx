"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SignupUser } from "@/store/AuthSlice";
import CicularLoader from "../components/CircularLoader";
import { useRouter } from 'next/navigation';

const Signup = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const halat = useSelector(state => state.auth.status);
    const status = useSelector(state => state.auth.Signupstatus);

    const emailRef = useRef();
    const userRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (status === true) {
            router.push("/Login");
        }
    }, [status]);

    function handle_Signup(e) {
        e.preventDefault();
        const form = new FormData();
        form.append("username", userRef.current.value);
        form.append("email", emailRef.current.value);
        form.append("password", passwordRef.current.value);
        dispatch(SignupUser(form));
    }

    return (
        <div className="min-h-screen w-full flex flex-col sm:flex-row items-center justify-center font-mono px-4 bg-white">
            {/* Image Section */}
            <div className="hidden sm:flex items-center justify-center w-1/2 p-6">
                <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-xl">
                    {/* The background image */}
                    <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Creative"
                    />
                    {/* Overlay to darken the image */}
                    <div className="absolute inset-0  opacity-30"></div>
                    {/* Text overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center uppercase">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            From your{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-sky-600">
                                brain
                            </span>{" "}
                            to the world!
                        </h1>
                    </div>
                </div>
            </div>


            {/* Signup Form */}
            <form
                onSubmit={(e) => handle_Signup(e)}
                className="w-full sm:w-1/2 max-w-md flex flex-col gap-5 justify-center p-6"
            >
                <h1 className="text-3xl font-bold text-center">Create an account!</h1>
                <span className="text-md text-center font-semibold text-gray-700">
                    Enter your details below
                </span>

                {/* Username */}
                <div className="w-full">
                    <label htmlFor="username" className="block mb-1 font-semibold">
                        Username
                    </label>
                    <input
                        ref={userRef}
                        id="username"
                        type="text"
                        placeholder="john doe"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium"
                    />
                </div>

                {/* Email */}
                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 font-semibold">
                        Email
                    </label>
                    <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        placeholder="johndoe@gmail.com"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium"
                    />
                </div>

                {/* Password */}
                <div className="w-full">
                    <label htmlFor="password" className="block mb-1 font-semibold">
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        id="password"
                        type="password"
                        placeholder="hfs8jjf@990jlf"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium"
                    />
                </div>

                {/* Submit Button */}
                {halat === "loading" ? (
                    <div className="flex items-center justify-center">
                        <CicularLoader />
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-lime-500 to-pink-500 text-black py-2 px-4 rounded-xl font-bold shadow-md shadow-black hover:scale-95 hover:shadow-lg  w-full transition-all"
                    >
                        Sign up
                    </button>
                )}

                <p className="text-center font-bold text-lg">
                    Already have an account?{" "}
                    <Link href="/Login" className="underline text-blue-600">
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
