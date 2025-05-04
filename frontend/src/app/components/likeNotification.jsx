'use client'
import React, { useEffect } from 'react';
import { UseStore } from '@/store/store';
import { AiOutlineLike } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
const LikeNotify = () => {
    const { like_notification, setLike_notification } = UseStore();
    useEffect(() => {
        const timer = setTimeout(() => {
            setLike_notification(null);
        }, 2000)

        return () => clearTimeout(timer);
    }, [like_notification])
    return (<>
        <div onClick={() => {
            setLike_notification(null)
        }} className={`bg-white p-5 rounded-xl border border-indigo-700 absolute top-12 right-12 cursor-pointer ${like_notification !== null ? "block translate-y-50" : "hidden  -translate-y-50"} z-[9999] duration-300 transition-all`}>
            <IoMdClose className='absolute top-1 right-2' />
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-700 to-indigo-700 flex items-center justify-center gap-3 font-bold  text-md">{like_notification !== null ? like_notification : "Nothing special for now!"} <AiOutlineLike className='animate-bounce' size={20} color='purple' /></span>
        </div>
    </>)
}

export default LikeNotify;