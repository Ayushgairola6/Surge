'use client'
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect}from 'react';
import {useSelector} from 'react-redux';
const Popup = () => {
  const router = useRouter();
  const isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
 
  useEffect(()=>{
    if(isLoggedIn===true){
        router.push("/")
    }
  },[isLoggedIn])

    return <>
        <div onClick={()=>coonsole.log(isLoggedIn)} className="flex items-center justify-center  h-[80vh]  font-mono text-center rounded-lg">
            <div className="m-auto flex flex-col items-center justify-center w-4/5 rounded-xl shadow-md shadow-black p-2 border-black border h-1/2">
                <h1 className="font-bold  text-3xl">You need an Account to  
                {' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-sky-700">CREATE</span> Posts
                </h1>
                <div className="flex items-center justify-center gap-10 mt-4">
                    <Link href="/Login">
                        <button className="shadow-md shadow-black hover:animate-pulse bg-green-500 py-1 text-black font-bold rounded-lg px-3 rounded-xl border border-black">Login</button>
                    </Link>
                    <Link href="/SignupPage">
                        <button className="shadow-md shadow-black hover:animate-pulse bg-sky-500 py-1 text-black font-bold rounded-lg px-3 rounded-xl border border-black">Signup</button>
                    </Link>

                </div>
            </div>


        </div>



    </>
}

export default Popup;