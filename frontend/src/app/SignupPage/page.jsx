"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SignupUser } from "@/store/AuthSlice";
import CicularLoader from "../components/CircularLoader";
import { useRouter } from 'next/navigation';
import Image from 'next/image'
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
        <div className="min-h-screen w-full flex flex-col sm:flex-row items-center justify-center
        gap-10 font-mono px-4 bg-black text-white py-4">
            {/* Image Section */}
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
                            <Image src="/male.jpg" alt="" height={25} width={25} className="rounded-full" />
                            <span className="font-serif text-md text-transparent 
                  bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700
                  ">Desruptive_daddy</span>
                        </div>
                        <h3 className="text-lg font-mono uppercase font-bold text-gray-300 mb-2">
                            "She Likes It Rough." Not in the way most people assume.
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-3">
                            She thrives in chaos—the kind that tests you, pushes you, shapes you into something stronger. She doesn’t flinch when things get messy, doesn’t back down when life demands more from her. She knows exactly who she is, and she moves through the world like nothing can break her.
                            That’s the first thing I noticed about her. Not just the confidence—the fire.
                            The way she speaks, the way she laughs with that unshaken certainty, like she already knows how the story ends. The way she treats people—never cold, never careless—but always real. She doesn’t sugarcoat, doesn’t pretend. She takes life as it is. And she takes you as you are.
                            
                        </p>
                    </div>


                </div>
            </div>


            {/* Signup Form */}
            <form
                onSubmit={(e) => handle_Signup(e)}
                className="w-full sm:w-1/2 max-w-md flex flex-col gap-5 justify-center p-6 bg-gradient-to-br from-white/15 to-black rounded-xl"
            >
                <h1 className="text-xl sm:text-2xl font-bold text-center
                 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 ">Create an account!</h1>
                <span className="text-sm text-center font-semibold text-gray-300">
                    Be the first one's to get early riser features
                </span>

                {/* Username */}
                <div className="w-full">
                    <label htmlFor="username" className="block mb-1 ">
                        Username
                    </label>
                    <input
                        ref={userRef}
                        id="username"
                        type="text"
                        placeholder="john doe"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium text-black"
                    />
                </div>

                {/* Email */}
                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 ">
                        Email
                    </label>
                    <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        placeholder="johndoe@gmail.com"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium text-black"
                    />
                </div>

                {/* Password */}
                <div className="w-full">
                    <label htmlFor="password" className="block mb-1 ">
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        id="password"
                        type="password"
                        placeholder="hfs8jjf@990jlf"
                        required
                        className="w-full border border-gray-400 focus:border-sky-400 rounded-xl px-3 py-2 text-lg font-medium text-black"
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
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-black py-2 px-4 rounded-xl font-bold shadow-md shadow-black hover:scale-95 hover:shadow-lg  w-full transition-all"
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
