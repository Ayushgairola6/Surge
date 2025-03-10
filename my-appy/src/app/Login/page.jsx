'use client'
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from '@/store/AuthSlice'
import Link from "next/link";
import { useRef, useState,useEffect } from 'react';
import CicularLoader from "../components/CircularLoader"
import {useRouter} from 'next/navigation';
import Toast from "../components/Toast";
const Login = () => {
   const router = useRouter();

    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
   const status = useSelector(state=>state.auth.loginstatus);
    // reference of the inputs
    const emailRef = useRef()
    const passwordRef = useRef()

    // state for form data
    useEffect(()=>{
      if(isLoggedIn===true){
       router.push("/")
      }
    },[isLoggedIn])

    function handle_Login(e) {
        // creating a new form
        e.preventDefault();
        const form = new FormData()
        form.append("email",emailRef.current.value);
        form.append("password",passwordRef.current.value)
        dispatch(LoginUser(form));

               return;
    }




    return <>
        <div className="h-screen  flex items-center flex-col sm:flex-row justify-evenly font-mono  relative">
            {/* login form */}
            {status==="success"?<Toast className="absolute"/>:null}
            <form  className=" h-full sm:w-1/2 w-full flex items-center  justify-center flex-col gap-2 " action="post">

                <h1 className="font-bold  text-xl  text-center">Welcom back !Ready to share your ideas?</h1>
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
            <div className="h-full md:flex flex-col items-center justify-center text-center flex-wrap p-2 uppercase hidden ">
             <h1 className="text-4xl font-bold ">your ideas <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-sky-600">matter </span> let's bring them to life</h1>

                <img className="h-3/5  w-3/5 rounded-full " src="https://plus.unsplash.com/premium_photo-1668383777295-8343df447607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdvcmtzcGFjZXxlbnwwfHwwfHx8MA%3D%3D" alt="/"/>
            </div>
        </div>


    </>
}

export default Login;