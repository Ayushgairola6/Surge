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
            className={`fixed left-0 top-0 z-[9999] transition-transform duration-300 ${Visible === true ? "-translate-x-0" : "-translate-x-full "} transition-all duration-500 ease-out  h-full w-60 bg-black text-white rounded-tr-xl border-r  border-purple-800 md:hidden lg:hidden `}
        >
            <button className="absolute top-1 right-4"   >
                <IoClose size={22} className="mt-2 ml-2 animate-bounce" />
            </button>
            <div className="flex flex-col items-center justify-normal gap-2 mt-8">
                <Link
                    href="/"
                    className="hover:bg-white w-full text-center text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><FaHome className="hover:animate-spin" /></span>
                    Home
                </Link>

                <Link
                    href={`${isLoggedIn === true ? "/createPost" : "/Popup"}`}
                    className="hover:bg-white w-full text-sm cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><IoCreate className="hover:animate-spin" /></span>
                    CreatePost
                </Link>

                <Link
                    href="/AllChats"
                    className="hover:bg-white w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><IoCreate className="hover:animate-spin" /></span>
                    Chats
                </Link>

                <Link
                    href="/Contact"
                    className="hover:bg-white w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><IoMdContacts className="hover:animate-spin" /></span>
                    Contact
                </Link>

                <a
                    href="https://instagram.com"
                    className="hover:bg-white w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><FaInstagramSquare className="hover:animate-spin" /></span>
                    Instagram
                </a>

                <Link
                    href={isLoggedIn === false ? "/Login" : "/Account"}
                    className="hover:bg-white w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                >
                    <span><MdOutlineDashboardCustomize className="hover:animate-spin" /></span>
                    {isLoggedIn === false ? "Login" : "Account"}
                </Link>

                {isLoggedIn === false && (
                    <Link
                        href="/SignupPage"
                        className="hover:bg-white w-full text-md cursor-pointer flex items-center justify-start px-6 transition-all gap-3 text-gray-200 hover:text-indigo-600"
                    >
                        <span><IoMdAdd /></span>
                        Signup
                    </Link>
                )}
            </div>

            <div className="absolute bottom-5 left-2 flex items-center justify-center w-full">
                <Link href="/Contact" className="bg-black text-white border border-white rounded-xl py-1 px-2 hover:bg-white hover:text-black transition-all" >
                    Support 
                </Link>
            </div>

        </div>
    </>
}

export default SideBar;