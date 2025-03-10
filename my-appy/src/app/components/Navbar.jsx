'use client'

import Image from "next/image";
import { RiMenu2Line } from 'react-icons/ri'
import { useState, useContext } from 'react';
import { useSelector } from "react-redux";
import SideBar from '../components/SideBar'
import { UseStore } from "@/store/store";
import Link from "next/link";
const Navbar = () => {
    // const { isLoggedIn } = UseStore();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const user = useSelector(state=>state.auth.user);
    const [Visible, setVisible] = useState(false)
    // show sidebar
    function ShowSidebar() {
        setVisible(!Visible);
        console.log('cld')
    }
    // hidesidebar
    function HideSideBar() {
        setVisible(!Visible)
        console.log('cld')

    }

    return (<header className=" border-b shadow-sm flex items-center justify-between py-1 px-6 font-mono font-bold ">

            <img className="h-12 w-16" src="/SurgeLogo.jpeg"/>

        <div className="hidden items-center justify-evenly gap-4 sm:flex ">
            <ul className="hover:bg-black hover:text-white w-full text-center  cursor-pointer px-2 ">
                <Link href="/">Home</Link>
            </ul>
            <ul className="hover:bg-black hover:text-white px-2 rounded-full w-full text-center  cursor-pointer">
                <Link href="/createPost">CreatePost</Link>
            </ul>
            <ul className="hover:bg-black hover:text-white px-2 rounded-full w-full text-center  cursor-pointer">
                <Link href="/AllChats">Chats</Link>
            </ul>
            <ul className="hover:bg-black hover:text-white px-2 rounded-full w-full text-center  cursor-pointer">
                <Link href="">Contact</Link>
            </ul>
            <ul className="hover:bg-black hover:text-white px-2 rounded-full w-full text-center  cursor-pointer">
                <Link href="/">
                    API
                </Link>

            </ul>
         

        </div>
        <div className=" flex items-center justify-between gap-6 pr-4" >
{/*
            <input placeholder="search topic.." type="text" className="rounded-full border-2 border-slate-300 px-2 " />*/}
          {user&&user.User?  <img className="h-12 w-12 rounded-full border border-green-300" src={user.User[0].image} alt="img"/>:null}
            {isLoggedIn === false ? <Link href="/SignupPage" className="hidden  sm:block bg-green-500 text-black  rounded-full py-1 px-3 shadow-md shadow-black border border-black hover:scale-90">Signup</Link> : <Link className="hidden  sm:block bg-green-500 text-black  rounded-full py-1 px-3 shadow-md shadow-black border border-black hover:scale-90" href={"/Account"}>Account</Link>}
           
            <button onClick={ShowSidebar}>
                <RiMenu2Line className="sm:hidden  block" />
 
            </button>
            {Visible === true ? (<>
                <SideBar HideSideBar={HideSideBar} />

            </>) : null}
        </div>


    </header>)
}
export default Navbar;