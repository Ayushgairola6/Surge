'use client'

import { Sidebar } from "lucide-react"
import Link from "next/link";
import { IoClose } from "react-icons/io5"
import { useSelector } from "react-redux";
const SideBar = ({ HideSideBar }) => {

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return <>
        <div 
        onClick={()=>console.log(isLoggedIn)}
        
        className="fixed right-0 top-0 z-20  border border-black h-full w-60 bg-white text-black ">
            <button className="absolute top-4 left-4" onClick={() => HideSideBar()}  >
                <IoClose className="mt-2 ml-2" />
            </button>
            <div className="flex flex-col items-center justify-normal gap-2 mt-6">
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    <Link href="/">Home</Link>
                </ul>
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    <Link href={`${isLoggedIn === true ? "/createPost" : "/Popup"}`}>CreatePost</Link>
                </ul>
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    <Link href="/AllChats">Chats</Link>
                </ul>
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    <Link href="">Contact</Link>
                </ul>
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    <Link href="/">
                        API
                    </Link>

                </ul>
                <ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                    {isLoggedIn === false ? <Link href={"/Login"}>login</Link> :
                        <Link href={"/Account"}>Account</Link>}
                </ul>
                {isLoggedIn === false ?<ul className="hover:bg-gray-300 w-full text-center font-bold text-lg cursor-pointer">
                  <Link href="/SignupPage">Signup</Link>  
                </ul>:null}
            </div>


        </div>
    </>
}

export default SideBar;