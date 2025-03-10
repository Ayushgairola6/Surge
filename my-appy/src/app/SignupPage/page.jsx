"use client"
import Link from "next/link";
import { useState, useRef ,useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SignupUser } from "@/store/AuthSlice";
import CicularLoader from "../components/CircularLoader"
import {useRouter} from 'next/navigation';
const Signup = () => {
  const router = useRouter();
    const dispatch = useDispatch();
    const halat =useSelector(state=>state.auth.status)

   const status = useSelector(state=>state.auth.Signupstatus);
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    })
   
   useEffect(()=>{
     if(status===true){
        router.push("/Login")
     }
   },[status])

    const emailRef = useRef();
    const userRef = useRef();
    const passwordRef = useRef();


    function handle_Signup(e) {
        e.preventDefault()
          const form = new FormData();
             form.append("username",userRef.current.value);
             form.append("email",emailRef.current.value);
             form.append("password",passwordRef.current.value);


        dispatch(SignupUser(form));
        return;
    }

    return <>
        <div className="h-screen  flex items-center flex-col sm:flex-row justify-evenly font-mono">
            {/* app image */}
            <div className="h-full md:flex flex-col items-center justify-center text-center flex-wrap p-2 uppercase hidden ">
             <h1 className="text-5xl font-bold ">From your <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-sky-600">BRAIN</span>  to the world!</h1>

                <img className="h-3/5  w-3/5 rounded-full " src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="/"/>
            </div>
            {/* signup form */}
            <form onSubmit={(e) => handle_Signup(e)} className=" h-full sm:w-1/2 w-full flex items-center  justify-center flex-col gap-2 " action="post">

                <h1 className="font-bold  text-2xl">Create an account!</h1>
                <span className=" text-md font-semibold">Enter your details below </span>
                <div className="  w-96  p-1">
                    <label className="text-start font-bold" htmlFor="username">Username</label>
                    <input ref={userRef} className="border border-black w-full px-0.5" placeholder="john doe" type="text" />
                </div>
                <div className="text-left w-96  p-1">
                    <label className="text-start font-bold" htmlFor="email">email</label>
                    <input ref={emailRef} className="border border-black w-full px-0.5" placeholder="johndoe@gmail.com" type="email" />
                </div>
                <div className="text-left w-96  p-1">
                    <label className="text-start font-bold" htmlFor="password">password</label>
                    <input placeholder="12345" ref={passwordRef} className="border border-black w-full px-0.5" type="password" />
                </div>
                {halat==="loading..."?<CicularLoader/>:<button className="bg-green-500 shadow-sm shadow-black hover:shadow-md hover:shadow-black hover:scale-90 transition-all text-black w-96 mt-2 p-1 rounded-xl font-bold " >Sign up</button>}

                <span className="mt-4 font-bold text-lg">Already have an account? <Link className="underline" href="/Login">Log In</Link></span>
            </form>

        </div>


    </>
}

export default Signup;