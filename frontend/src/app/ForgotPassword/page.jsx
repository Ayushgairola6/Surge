'use client'

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ResetPassword, updateState } from '../../store/AuthSlice'
import { MdOutlineSmsFailed, MdSearch, MdArrowBack } from 'react-icons/md'
import Link from 'next/link';

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const email = useRef();
    const newPassword = useRef();
    const confirmPassword = useRef();
    const status = useSelector(state => state.auth.passwordUpdated);
    const [arrow,setArrow] = useState(false);
    const handleResetPassword = async () => {
        if (email.current.value === "" || newPassword.current.value === "" || confirmPassword.current.value === "") { return }
        if (newPassword.current.value !== confirmPassword.current.value) {
            alert("Password did not match");
            return;
        }
        const data = {
            email: email.current.value,
            password: newPassword.current.value
        }
        dispatch(ResetPassword(data))

    }

    useEffect(() => {
        if (status === "failed") {
            setTimeout(() => {
                dispatch(updateState())
            }, 2000)
        }
    }, [status])



    return (<>

        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 flex-col">
            <div className="py-12 px-4 bg-gradient-to-r from-white/5 to-black rounded-2xl shadow-2xl shadow-gray-700 max-w-lg w-full">
                <div className="mb-6 text-center ">
                    <h1 className="text-xl font-serif bg-clip-text
                     text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">Maybe start eating almonds</h1>
                    <span className="text-gray-300 text-md ">It'll help you remember your password next time!</span>
                </div>

                <section className="flex flex-col gap-6 w-full px-6">
                    <label htmlFor="email" className="text-white text-md font-semibold">Your email address</label>
                    <input ref={email} placeholder="Johndoe@gmail.com" type="email" className="p-2 w-full
                     rounded-xl border border-gray-400 focus:ring-2 focus:ring-sky-500 shadow-sm text-black" />
                </section>

                <section className="flex flex-col gap-6 w-full px-6 mt-4">
                    <label htmlFor="newPassword" className="text-white text-md font-semibold">New Password</label>
                    <input ref={newPassword} placeholder="New Password" type="password" className="p-2 w-full
                    text-black rounded-xl border border-gray-400 focus:ring-2 focus:ring-sky-500 shadow-sm" />
                </section>

                <section className="flex flex-col gap-6 w-full px-6 mt-4">
                    <label htmlFor="confirmPassword" className="text-white text-md font-semibold">Confirm Password</label>
                    <input ref={confirmPassword} placeholder="Confirm Password" type="password" className="p-2 w-full text-black
                     rounded-xl border border-gray-400 focus:ring-2 focus:ring-sky-500 shadow-sm" />
                </section>

                <div className="mt-6 w-full ">
                    {status === "pending" && (
                        <div className="bg-sky-600
                        flex items-center justify-center gap-3   transition-all duration-700 
                        text-white p-3 w-[90%] rounded-xl mt-6 text-center font-bold">
                            Please wait...
                            <div className="border-t-2 h-5 w-5 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {status === "failed" && (
                        <div className="bg-red-200  transition-all duration-700
                        flex items-center justify-center gap-3  text-red-600 p-3 w-[90%] mt-6 rounded-xl text-center border border-red-600 font-bold">
                            Something went wrong! <MdOutlineSmsFailed className="" />
                        </div>
                    )}

                    {status === "idle" && (
                        <button onClick={() => handleResetPassword()} className="bg-gradient-to-r from-indigo-600 to-purple-600
                         hover:from-indigo-600 hover:to-sky-600  text-black
                          transition-all duration-300  p-3 w-[90%] mt-6 cursor-pointer font-bold rounded-xl text-center">
                            Proceed
                        </button>
                    )}

                </div>
                <span onMouseOver={() => setArrow(true)}
                    onMouseOut={() =>setArrow(false)}
                    className="flex items-center justify-center w-full p-2 mt-2 hover:underline transition-all duration-500 text-gray-400 text-sm cursor-pointer gap-3">
                    <Link href="/Login">Back to Login</Link>
                    <MdArrowBack size={20}  className={`${arrow===true?"rotate-0 opacity-100":"-rotate-180 opacity-0"}  transition-all duration-500 `} />
                </span>

            </div>
        </div>

    </>
    )
}

export default ForgotPassword;