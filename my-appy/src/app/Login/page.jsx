'use client'
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from '@/store/AuthSlice'
import Link from "next/link";
import { useRef, useState } from 'react';
import CicularLoader from "../components/CircularLoader"
import {redirect} from 'next/navigation'
import Toast from "../components/Toast";

const Login = () => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
   const status = useSelector(state=>state.auth.loginstatus);

    // reference of the inputs
    const emailRef = useRef()
    const passwordRef = useRef()

    // state for form data
    

    function handle_Login(e) {
        // creating a new form
        e.preventDefault();
        const form = new FormData()
        form.append("email",emailRef.current.value);
        form.append("password",passwordRef.current.value)
        dispatch(LoginUser(form));

        if(isLoggedIn===true){
            redirect("/")
        }
        return;
    }




    return <>
        <div className="h-screen w-screen flex items-center flex-col sm:flex-row justify-evenly font-mono  relative">
            {/* login form */}
            {status==="success"?<Toast className="absolute"/>:null}
            <form  className=" h-full sm:w-1/2 w-full flex items-center  justify-center flex-col gap-2 " action="post">

                <h1 className="font-bold  text-2xl">Login to your account</h1>
                <span className=" text-sm">Enter your email below to login to your account</span>
                <div className="  w-96  p-1">
                    <label className="text-start font-bold" htmlFor="email">Email</label>
                    <input ref={emailRef} className="border border-black w-full px-0.5" placeholder="" type="email" />
                </div>
                <div className="text-left w-96  p-1">
                    <ul className="flex items-center justify-between font-bold">
                        <label htmlFor="password">Password</label>
                        <Link href="/Signup">Forgot your password?</Link>
                    </ul>
                    <input ref={passwordRef} className="border border-black w-full px-0.5" type="password" />
                </div>
                {status==="loading"?<CicularLoader/>:<button onClick={(e)=>handle_Login(e)} className="bg-green-500 text-black w-96 mt-2 p-1 rounded-xl font-bold shadow-md border border-black shadow-black hover:scale-90" >Login</button>
                }
                <span className="mt-4 font-bold text-lg">Don't have an account? <Link className="underline" href="/SignupPage">Sign up</Link></span>
            </form>
            {/* app image */}
            <img className=" h-full w-1/2 hidden sm:block" src="/cyberpunk.jpg" alt="" />
        </div>


    </>
}

export default Login;