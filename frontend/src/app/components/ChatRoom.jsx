'use client'
import { io } from 'socket.io-client';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAccount } from '@/store/AuthSlice';
const ChatRoom = ({ id }) => {

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(GetAccount())
	}, [dispatch])

	const user = useSelector(state => state.auth.user);
	const messageInput = useRef();
	// state variable to store the socket instance
	const socket = useRef(null)
	const [messages, setMessage] = useState([]);
	const [user1, setUser1] = useState(null);
	const [senderName, setSenderName] = useState(user.User[0].username);
	const [user2, setUser2] = useState(null);
	const [roomName, setRoomName] = useState(null)
	const token = localStorage.getItem("userdata");

	// connecting with the socket instance
	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		try {
			if (!token) {
				return;
			}
			//socket port
			socket.current = io("https://surge-oyqw.onrender.com", {
				auth: { token },
				withCredentials: true,
			})
			// emit a connection event 
			socket.current.on("connection", () => {
			})

			// emit a join chat event with user 2 data
			if (id) { socket.current.emit("joinChat", { selectedUser: id }) };

			socket.current.on("roomJoined", (data) => {
				setRoomName(data.roomName);
				setUser1(user.User[0].id);
				setUser2(id);

			})
			// listening to the updated messages that are being currently listened

			socket.current.on("newMessage", (data) => {
				setMessage((prev) => (Array.isArray(prev) ? [...prev, data] : [data]))
			})


		} catch (error) {
			throw error;
		}

		return () => {
			socket.current.disconnect();
		};
	}, [roomName, user1, user2]);




	return <>
		<div className="bg-gray-300 h-screen w-screen relative">
			{/*chats*/}
			<div onClick={() => console.log(messages)} className="h-[90%] text-black ">
				{messages.map((message, index) => {
					return <div className={`${message.sender_id === user1 ? "text-left" : "text-right"} px-4 py-2`} key={index}>
						<ul className='text-lg font-bold'>{message.sender_name}</ul>
						<ul className='text-md'>{message.message}</ul>
					</div>
				})}
			</div>
			{/*input and send button*/}
			<div className=" h-[20%] flex items-center justify-center gap-4 absolute bottom bg-white  w-full">
				<input ref={messageInput} className="rounded-xl p-2 font-bold w-[70%] border border-black" placeholder="Enter your message here..." type="text" />
				<button onClick={() => {
					if (!socket.current) return;
					socket.current.emit("message", ({ roomName: roomName, user1: user1, user2: user2, message: messageInput.current.value, sender_name: senderName }));
					messageInput.current.value = "";
				}} className="bg-sky-500 px-4 font-bold rounded-xl border border-black shadow-md shadow-black">
					Send
				</button>
			</div>
		</div>

	</>
}

export default ChatRoom