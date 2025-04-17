// "use client"
// import Link from "next/link";
// import { useState, useRef ,useEffect} from 'react';
// import { useDispatch, useSelector } from "react-redux";
// import { SignupUser } from "@/store/AuthSlice";
// import CicularLoader from "../components/CircularLoader"
// import {useRouter} from 'next/navigation';
// const Signup = () => {
//   const router = useRouter();
//     const dispatch = useDispatch();
//     const halat =useSelector(state=>state.auth.status)

//    const status = useSelector(state=>state.auth.Signupstatus);
//     const [data, setData] = useState({
//         username: "",
//         email: "",
//         password: ""
//     })

//    useEffect(()=>{
//      if(status===true){
//         router.push("/Login")
//      }
//    },[status])

//     const emailRef = useRef();
//     const userRef = useRef();
//     const passwordRef = useRef();


//     function handle_Signup(e) {
//         e.preventDefault()
//           const form = new FormData();
//              form.append("username",userRef.current.value);
//              form.append("email",emailRef.current.value);
//              form.append("password",passwordRef.current.value);


//         dispatch(SignupUser(form));
//         return;
//     }

//     return <>
//         <div className="h-screen  flex items-center flex-col sm:flex-row justify-evenly font-mono">
//             {/* app image */}
//             <div className="h-full md:flex flex-col items-center justify-center text-center flex-wrap p-2 uppercase hidden ">
//              <h1 className="text-5xl font-bold ">From your <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-sky-600">BRAIN</span>  to the world!</h1>

//                 <img className="h-3/5  w-3/5 rounded-full " src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="/"/>
//             </div>
//             {/* signup form */}
//             <form onSubmit={(e) => handle_Signup(e)} className=" h-full md:w-1/2 w-[90%] flex items-center  justify-center flex-col gap-2 " action="post">

//                 <h1 className="font-bold  text-2xl">Create an account!</h1>
//                 <span className=" text-md font-semibold">Enter your details below </span>
//                 <div className="  w-96  p-1">
//                     <label className="text-start font-bold" htmlFor="username">Username</label>
//                     <input ref={userRef} className=" w-full border border-gray-400 focus-border-sky-400 rounded-xl px-2 font-bold text-lg" placeholder="john doe" type="text" />
//                 </div>
//                 <div className="text-left w-96  p-1">
//                     <label className="text-start font-bold" htmlFor="email">email</label>
//                     <input ref={emailRef} className=" w-full border border-gray-400 focus-border-sky-400 rounded-xl px-2 font-bold text-lg" placeholder="johndoe@gmail.com" type="email" />
//                 </div>
//                 <div className="text-left w-96  p-1">
//                     <label className="text-start font-bold" htmlFor="password">password</label>
//                     <input placeholder="hfs8jjf@990jlf" ref={passwordRef} className="border border-gray-400 focus-border-sky-400 rounded-xl px-2 w-full  font-bold text-lg" type="password" />
//                 </div>
//                 {halat==="loading..."?<CicularLoader/>:<button className="bg-green-500 shadow-sm shadow-black hover:shadow-md hover:shadow-black hover:scale-90 transition-all text-black w-96 mt-2 p-1 rounded-xl font-bold " >Sign up</button>}

//                 <span className="mt-4 font-bold text-lg">Already have an account? <Link className="underline" href="/Login">Log In</Link></span>
//             </form>

//         </div>


//     </>
// }

// export default Signup;
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
                onSubmit={(e)=>handle_Signup(e)}
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
                {halat === "loading..." ? (
                    <CicularLoader />
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
