'use client'
import { useEffect, useState, useRef } from 'react';
import { GetChats, GetRoomSpecificChats } from '../../store/ChatSlice';
import { GetAccount } from '../../store/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Link from 'next/link';

const AllChats = () => {
    const messageInput = useRef();
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chat.chats);
    const roomdata = useSelector(state => state.chat.chatData);
    const User = useSelector(state => state.auth.user);
    const [room_name, setRoomname] = useState(null);
    const userid = User?.User?.[0]?.id ?? null;
    const [senderName, setSenderName] = useState(User?.User?.[0]?.username ?? "");
    const [messages, setMessage] = useState([]);
    const [user2, setUser2] = useState(null);
    const socket = useRef(null);

    useEffect(() => {
        if (User) {
            dispatch(GetChats());
        }
    }, [dispatch]);

    useEffect(() => {
        if (chats) {
            dispatch(GetRoomSpecificChats(chats[0].room_name));
        }
    }, [dispatch, chats]);

    useEffect(() => {
        if (roomdata !== null && User?.User?.[0]?.id) {
            const lastMessage = roomdata[roomdata.length - 1];
            if (lastMessage.sender_id === User.User[0].id) {
                setUser2(lastMessage.receiver_id);
            } else {
                setUser2(lastMessage.sender_id);
            }
        }
    }, [roomdata]);

    useEffect(() => {
        if (chats !== null) {
            setRoomname(chats[0].room_name);
        }
    }, [chats]);

    useEffect(() => {
        const token = localStorage.getItem("userdata");
        if (!token) {
            return;
        }
        try {
            socket.current = io("https://surge-oyqw.onrender.com", {
                auth: { token },
            });
            socket.current.on("connect", () => {});
            socket.current.emit("joinChat", { selectedUser: user2 });
            socket.current.on("newMessage", (data) => {
                setMessage((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
            });
        } catch (error) {
            throw error;
        }
        return () => {
            socket.current.disconnect();
        };
    }, [user2]);

    const GetRoomData = (chat) => {
        setRoomname(chat.room_name);
        dispatch(GetRoomSpecificChats(chat.room_name));
    };

    const SendMessage = () => {
        if (!socket.current || !User?.User?.[0]) return;
        if (roomdata !== null) {
            const lastMessage = roomdata[roomdata.length - 1];
            if (lastMessage.sender_id === User.User[0].id) {
                setUser2(lastMessage.receiver_id);
            } else {
                setUser2(lastMessage.sender_id);
            }
        }
        socket.current.emit("message", {
            roomName: room_name,
            user1: User.User[0].id,
            user2: user2,
            message: messageInput.current.value,
            sender_name: senderName
        });
        messageInput.current.value = "";
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full p-4 gap-4 overflow-hidden">
            {/* Chat Rooms */}
            <div className="w-full md:w-1/3 lg:w-1/4 border border-gray-400 rounded-xl p-4 overflow-auto">
                {chats !== null ? (
                    chats.map((chat, index) => (
                        <div key={index} onClick={() => GetRoomData(chat)}
                            className="flex items-center justify-between p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                            <span>{chat.room_name}</span>
                            <img className="h-10 w-10 border-2 border-green-400 rounded-full" src="/NoImage.jpg" />
                        </div>
                    ))
                ) : (
                    <div className="animate-pulse border border-gray-400 py-3 px-4 rounded-xl flex items-center justify-between">
                        Loading...
                    </div>
                )}
            </div>
            {/* Chat Window */}
            {roomdata !== null && (
                <div className="w-full md:w-2/3 lg:w-3/4 border border-gray-400 rounded-xl flex flex-col p-4 overflow-auto">
                    <div className="flex-1 overflow-auto space-y-4">
                        {[...roomdata, ...messages].map((chat, index) => (
                            <div key={index} className={`p-3 rounded-lg max-w-[75%] ${chat.sender_id === userid ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}>
                                <div className="font-bold">{chat.sender_name}</div>
                                <div>{chat.message}</div>
                            </div>
                        ))}
                    </div>
                    {/* Input Box */}
                    <div className="flex items-center gap-2 mt-4">
                        <input ref={messageInput} className="flex-1 border border-gray-400 rounded-xl p-2" placeholder="Your message" type="text" />
                        <button onClick={SendMessage} className="bg-sky-400 px-4 py-2 rounded-xl text-white font-bold shadow-md hover:bg-sky-500 transition">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllChats;
