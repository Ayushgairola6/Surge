'use client'

import Image from "next/image";
import { RiMenu2Line } from 'react-icons/ri'
import { useState, useContext } from 'react';
import { useSelector } from "react-redux";
import SideBar from '../components/SideBar'
import { UseStore } from "@/store/store";
import { AiFillHome } from "react-icons/ai";
import { BsFillPenFill } from "react-icons/bs";
import { RiChatSmile2Fill } from "react-icons/ri";
import { MdContactMail } from "react-icons/md";
import Link from "next/link";
const Navbar = () => {
    // const { isLoggedIn } = UseStore();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const user = useSelector(state => state.auth.user);
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

    return (<header className="  shadow-sm flex items-center justify-between py-2 px-6 font-mono  bg-black">
        <Link href="/">
            <img className="h-10 w-10 rounded-full cursor-pointer" src="/images.jpeg" />
        </Link>


        <div className="hidden items-center justify-evenly gap-4 sm:flex">
            <Link
                href="/"
                className="hover:bg-white hover:text-black w-full text-center cursor-pointer px-2 flex items-center gap-2 justify-center rounded-full text-white transition-all duration-500"
            >
                <AiFillHome className="text-sm" />
                Home
            </Link>

            <Link
                href="/createPost"
                className="hover:bg-white hover:text-black px-2 rounded-full w-full text-center cursor-pointer flex items-center gap-2 justify-center text-white transition-all duration-500"
            >
                <BsFillPenFill className="text-sm" />
                CreatePost
            </Link>

            <Link
                href="/AllChats"
                className="hover:bg-white hover:text-black px-2 rounded-full w-full text-center cursor-pointer flex items-center gap-2 justify-center text-white transition-all duration-500"
            >
                <RiChatSmile2Fill className="text-sm" />
                Chats
            </Link>

            <Link
                href="/Contact"
                className="hover:bg-white hover:text-black px-2 rounded-full w-full text-center cursor-pointer flex items-center gap-2 justify-center text-white transition-all duration-500"
            >
                <MdContactMail className="text-sm" />
                Contact
            </Link>
        </div>
        <div className=" flex items-center justify-between gap-6 pr-4" >
            {/*
            <input placeholder="search topic.." type="text" className="rounded-full border-2 border-slate-300 px-2 " />*/}
            {user && user.User ? <Link href={"/Account"}><img className="h-12 w-12 rounded-full border border-indigo-300" src={user.User[0].image} alt="img" /> </Link> : null}
            {isLoggedIn === false ? <Link href="/Login" className="hidden  sm:block bg-white text-black  rounded-full py-1 px-3 shadow-md shadow-black border border-black hover:scale-90 transition-all">Login</Link> : null}
            {isLoggedIn === false ? <Link href="/SignupPage" className="hidden  sm:block bg-gradient-to-r from-indigo-500 to-purple-500 text-black  rounded-full py-1 px-3 shadow-md shadow-black border border-black hover:scale-90 transition-all">Signup</Link> : <Link className="hidden  sm:block bg-gradient-to-r from-indigo-500 to-purple-500 text-black  rounded-full py-1 px-3 shadow-md shadow-black border border-black hover:scale-90 transition-all" href={"/Account"}>Account</Link>}

            <button onClick={ShowSidebar}>
                <RiMenu2Line size={22} className="sm:hidden  block" color="white" />

            </button>

            <SideBar Visible={Visible} setVisible={setVisible} HideSideBar={HideSideBar} />


        </div>


    </header>)
}
export default Navbar;