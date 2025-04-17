'use client'

import { Sidebar } from "lucide-react"
import Link from "next/link";
import { IoClose } from "react-icons/io5"
import { useSelector } from "react-redux";
import { FaHome, FaInstagramSquare } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { IoMdContacts, IoMdAdd } from "react-icons/io";
import { MdOutlineDashboardCustomize } from "react-icons/md";
const SideBar = ({ HideSideBar, setVisible, Visible }) => {

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return <>
        <div

            onClick={() => {
                setVisible(!Visible)

            }}
            className={`fixed left-0 top-0 z-20 transition-transform duration-300 ${Visible === true ? "-translate-x-0" : "-translate-x-full "} transition-all duration-500 ease-out  h-full w-60 bg-white text-black rounded-tr-xl border-r  border-gray-400 md:hidden lg:hidden`}
        >
            <button className="absolute top-1 right-4"   >
                <IoClose size={22} className="mt-2 ml-2 animate-bounce" />
            </button>
            <div className="flex flex-col items-center justify-normal gap-2 mt-8">
                <Link
                    href="/"
                    className="hover:bg-gray-300 w-full text-center text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><FaHome className="hover:animate-spin" /></span>
                    Home
                </Link>

                <Link
                    href={`${isLoggedIn === true ? "/createPost" : "/Popup"}`}
                    className="hover:bg-gray-300 w-full text-sm cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><IoCreate className="hover:animate-spin" /></span>
                    CreatePost
                </Link>

                <Link
                    href="/AllChats"
                    className="hover:bg-gray-300 w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><IoCreate className="hover:animate-spin" /></span>
                    Chats
                </Link>

                <Link
                    href="/Contact"
                    className="hover:bg-gray-300 w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><IoMdContacts className="hover:animate-spin" /></span>
                    Contact
                </Link>

                <Link
                    href="/"
                    className="hover:bg-gray-300 w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><FaInstagramSquare className="hover:animate-spin" /></span>
                    Instagram
                </Link>

                <Link
                    href={isLoggedIn === false ? "/Login" : "/Account"}
                    className="hover:bg-gray-300 w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                >
                    <span><MdOutlineDashboardCustomize className="hover:animate-spin" /></span>
                    {isLoggedIn === false ? "Login" : "Account"}
                </Link>

                {isLoggedIn === false && (
                    <Link
                        href="/SignupPage"
                        className="hover:bg-gray-300 w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-600 hover:text-indigo-600"
                    >
                        <span><IoMdAdd /></span>
                        Signup
                    </Link>
                )}
            </div>

            <div className="absolute bottom-5 left-2 flex items-center justify-center w-full">
                <a className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl py-3 px-4 text-black shadow-sm shadow-gray-500" href="/mailto://ayushgairola2002@gmail.com">
                    Support +
                </a>
            </div>

        </div>
    </>
}

export default SideBar;