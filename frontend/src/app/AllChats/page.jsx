'use client'
import { useEffect, useState, useRef } from 'react';
import { GetChats, GetRoomSpecificChats } from '../../store/ChatSlice';
import { GetAccount } from '../../store/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { UseStore } from '@/store/store';

const AllChats = () => {
  const router = useRouter();
  const messageInput = useRef();
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const roomdata = useSelector(state => state.chat.chatData);
  const User = useSelector(state => state.auth.user);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [room_name, setRoomname] = useState(null);
  const userid = User?.User?.[0]?.id ?? null;
  const [senderName, setSenderName] = useState(User?.User?.[0]?.username ?? "");
  // "messages" holds live incoming messages for the active room
  const [messages, setMessage] = useState([]);
  const [user2, setUser2] = useState(null);
  // const {socket } = UseStore();
  const socket = useRef();
  const bottomRef = useRef(null);

  const roomNameRef = useRef(room_name);
  useEffect(() => {
    roomNameRef.current = room_name;
  }, [room_name]);

  useEffect(() => {
    if (User && isLoggedIn === true) {
      dispatch(GetChats());
    } else if (isLoggedIn === false) {
      router.push('/Popup');
    }
  }, [isLoggedIn, User]);

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
    const token = localStorage.getItem("auth_token");
    try {
      socket.current = io("http://localhost:8080", {
        auth: { token },
        withCredentials: true
      });
      socket.current.emit("joinChat", { selectedUser: user2 });

      socket.current.on("newMessage", (data) => {
        if (data.roomName === roomNameRef.current) {
          setMessage(prev => (Array.isArray(prev) ? [...prev, data] : [data]));
        }
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
    setMessage([]); // Clear live messages from any previous room
    dispatch(GetRoomSpecificChats(chat.room_name));
  };

  const SendMessage = () => {
    if (!socket.current || !User?.User?.[0]) {
      console.log(socket.current, User);
      return;
    }
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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full p-4 gap-4 bg-black overflow-auto text-white">
      {/* Chat Rooms for Mobile Devices (Horizontal Scroll Layout) */}
      <div className="block md:hidden">
        <div className="flex overflow-x-auto space-x-4 bg-gradient-to-br from-white/5  to-white/15 bg-opacity-80 shadow-md shadow-indigo-800 rounded-xl p-2  mb-4">
          {chats !== null ? (
            chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => GetRoomData(chat)}
                className="flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl cursor-pointer transition-all   shadow-sm"
              >
                <img
                  className="h-10 w-10 rounded-full border border-indigo-700 shadow-sm"
                  src={chat.image === null ? "/NoImage.jpg" : chat.image}
                  alt="Avatar"
                />
                <span className="font-medium text-white mt-2">{chat.username}</span>
              </div>
            ))
          ) : (
            <div className="animate-pulse border py-3 px-4 rounded-xl flex items-center justify-center">
              No connections.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4">
        {/* Chat Rooms for Larger Screens (Vertical Layout) */}
        <div className="hidden md:block w-full md:w-1/3 lg:w-1/4 bg-black text-white bg-opacity-80 border border-indigo-300 rounded-xl p-4 overflow-auto shadow-lg">
          {chats !== null ? (
            chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => GetRoomData(chat)}
                className="flex items-center justify-between px-3 py-2 gap-3  bg-opacity-70 rounded-xl cursor-pointer transition-all 0 shadow-sm mb-2"
              >
                <span className="font-medium text-gray-200">{chat.username}</span>
                <img
                  className="h-10 w-10 rounded-full border border-indigo-700 shadow-sm"
                  src={chat.image === null ? "/NoImage.jpg" : chat.image}
                  alt="Avatar"
                />
              </div>
            ))
          ) : (
            <div className="animate-pulse border py-3 px-4 rounded-xl flex items-center justify-center">
              Loading...
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-black bg-opacity-90  rounded-xl flex flex-col p-4 overflow-auto shadow-lg">
          {roomdata && messages ? <div className="flex-1 overflow-auto space-y-4">
            {[...roomdata, ...messages].map((chat, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow  ${chat.sender_id === userid ? ' text-left' : ' text-right'}  rounded-xl p-2   `}
                
              >
                <label className={`${chat.sender_id === userid ? "text-purple-600" : "text-indigo-600"} text-lg font-bold`}>
                  {chat.sender_name}
                </label>
                <p className='text-white'>{chat.message}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div> : null}
          <div className="flex items-center gap-2 mt-4">
            <input
              ref={messageInput}
              className="flex-1 border border-gray-300 rounded-xl p-2 shadow focus:ring focus:ring-blue-300 outline-none"
              placeholder="Your message"
              type="text"
            />
            <button
              type="submit"
              onClick={SendMessage}
              className="bg-gradient-to-r from-indigo-700 to-purple-700 px-4 py-2 rounded-xl text-white font-bold shadow-md transition hover:from-indigo-500 hover:to-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllChats;
