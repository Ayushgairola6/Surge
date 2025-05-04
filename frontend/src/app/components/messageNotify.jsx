import React, { useEffect } from 'react';
import { UseStore } from '@/store/store';
import { LuMessagesSquare } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

const MessageNotify = () => {
    const { message_notification, setMessage_notification } = UseStore();

    useEffect(() => {
        const timer = setTimeout(() => {

        }, 2000)
    }, [message_notification])

    return (<>
        <div onClick={() => {
            setMessage_notification(null);
        }} className={`${message_notification !== null ? "opacity-100 -translate-x-10" : "opacity-0 translate-x-10"} absolute top-10 left-10 rounded-xl bg-white p-4 z-[9999]`}>
            <IoMdClose className='absolute top-2 right-2' />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 flex item-center justify-center gap-3">{message_notification !== null ? message_notification : "Don't make them wait"}<LuMessagesSquare /></span>
        </div>
    </>)
}

export default MessageNotify;